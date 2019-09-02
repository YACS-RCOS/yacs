import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Schedule, Section } from 'yacs-api-client';
import { ScheduleSet } from '../models/schedule-set';
import { SelectionService } from '../services/selection.service';
import { ScheduleComponent } from '../schedule-view/schedule/component';
// import 'rxjs/Rx';
import {Subject, Subscription} from 'rxjs/Rx';
import * as domtoimage  from 'dom-to-image';

@Component({
    selector: 'schedule-view',
    templateUrl: './component.html',
    styleUrls: ['./component.scss']
})

export class ScheduleViewComponent implements OnInit, OnDestroy, AfterViewInit {
    @ViewChildren(ScheduleComponent)
    public ScheduleList: QueryList<ScheduleComponent>

    height: number = 600;
    private emptyScheduleSet: ScheduleSet = new ScheduleSet([], this.height);

    isLoaded: boolean = false;
    scheduleSet: ScheduleSet = this.emptyScheduleSet;
    scheduleNode;

    // false if viewing temporary schedule, otherwise true
    notTemporary: boolean = true;
    finishedInit: boolean = false;
    
    private subscription;

    constructor (
        private selectionService : SelectionService,
        private router : Router,
        private activatedRoute: ActivatedRoute) {
        this.subscription = this.selectionService.subscribe(() => {
            if (this.notTemporary && this.finishedInit) this.getSchedules();
        });
    }

    public ngOnDestroy (): void {
        this.subscription.unsubscribe();
    }

    public ngOnInit (): void {
        // check if schedule link entered

        // maybe do this with ActivatedRouteSnapshot later

        /* TODO: check if schedule link supports multiple terms.
        Probably doesn't so will need to be implemented.
        */

        /* TODO: schedule index setting is not yet implemented */

        let url: string = window.location.href;
        let i1: number = url.indexOf('schedules?section_ids=');
        let i2: number = url.indexOf('&schedule_index=');
        if (i1 != -1) {
            this.selectionService.clear(false);
            this.notTemporary = false;
            let end: number = (i2 != -1) ? i2 : url.length;
            const section_ids = url.substring(i1 + 22, end).split(',');

            // set schedule to display proper index
            let index: number = 0;
            if (i2 != -1) {
                index = parseInt(url.substring(i2 + 16), 10);
            }

            // add sections to temporary schedule
            Section
            .where({id: section_ids})
            .includes('listing')
            .includes('listing.sections')
            .all().then((sections) => {
                sections.data.forEach(section => {
                    this.selectionService.addSection(section, false);
                });
                this.getSchedules();
            });

        } else {
            this.getSchedules();
        }
        this.finishedInit = true;
    }

    public ngAfterViewInit (): void {
        this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) => {
            this.scheduleNode = comps.first.scheduleNode;
        });
    }

    private getSchedules (): void {
        this.isLoaded = false;
        const sectionIds = this.selectionService.getSelectedSectionIds(this.notTemporary);
        Schedule
        .where({ section_id: sectionIds})
        .includes('sections')
        .includes('sections.listing')
        .all().then((schedules) => {
            // TODO: Handle this in yacs-api-client
            schedules.data.forEach(schedule => {
                schedule.sections.forEach(section => {
                    section.periods.forEach(period => {
                        period.section = section;
                    });
                });
            });
            this.scheduleSet = new ScheduleSet(schedules.data, this.height);
            this.isLoaded = true;
        });
    }

    public get activeScheduleIndex (): number {
        return (this.scheduleSet.numSchedules > 0) ? this.scheduleSet.activeScheduleIndex + 1 : 0;
    }

    public replaceSelections (): void {
        // remove temporary schedule view
        this.notTemporary = true;
        this.router.navigate(['/schedules']);

        // remove currently selected sections
        let sectionIds = this.selectionService.getSelectedSectionIds(true);
        if (sectionIds.length != 0) {
        	Section
	        .where({id: sectionIds})
	        .includes('listing')
	        .includes('listing.sections')
	        .all().then((sections) => {
	            sections.data.forEach(section => {
	                this.selectionService.removeSection(section, true);
	            });
	            // this.getSchedules();
	        });	
        } 

        // add sections from temporary schedule to currently selected sections
        sectionIds = this.selectionService.getSelectedSectionIds(false);
        if (sectionIds.length != 0) {
	        Section
	        .where({id: sectionIds})
	        .includes('listing')
	        .includes('listing.sections')
	        .all().then((sections) => {
	            sections.data.forEach(section => {
	                this.selectionService.addSection(section, true);
	            });
	            this.getSchedules();
	        });
	    }
    }

    public keepSelections (): void {
        this.notTemporary = true;
        this.router.navigate(['/schedules']);
        this.getSchedules();
    }

    public get statusText (): string {
        if (this.scheduleSet.activeSections.length > 0) {
            return `CRNs: ${this.scheduleSet.activeSections.map(s => s.crn).join(', ')}`;
        }
        return "Nothing to see here. Try adding some courses :)"
    }

    public downloadImage (): void {
        var node = this.scheduleNode;

        domtoimage.toPng(node, { bgcolor:"white", quality: 1.0 })
        .then(function (dataUrl) {
            var link = document.createElement('a');
            link.download = 'mySchedules.png';
            link.href = dataUrl;
            link.click();
        })
        .catch(function(error) {
            console.error('oops, something went wrong!', error);
        });
    }

    public copyToClipboard (val: string) {
        let textArea = document.createElement('textarea');
        textArea.value = val;
        textArea.style.position = 'fixed';
        textArea.style.left = '0'
        textArea.style.top = '0'
        textArea.style.opacity = '0';

        document.body.appendChild(textArea);
        textArea.select();
        let success = document.execCommand('copy');

        if (!success) {
            console.error('Copying failed!');
        }

        document.body.removeChild(textArea);
    }

    public copyLink () {        
        let selectedSections: string = this.selectionService.getSelectedSectionIds(this.notTemporary).join(',');
        let scheduleIndex: number = this.activeScheduleIndex - 1;
        let schedule_link: string = window.location.protocol + '//' 
        + window.location.host + '/schedules?section_ids='
        + selectedSections + '&schedule_index=' + scheduleIndex;

        this.copyToClipboard(schedule_link);
    }

    public clearSelections (): void {
        this.selectionService.clear(this.notTemporary);
    }
}

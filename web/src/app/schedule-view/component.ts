import { Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, QueryList, Input } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Schedule } from 'yacs-api-client';
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
	isTemporary: boolean = false;
	scheduleNode;

	private subscription;

	constructor (
		private selectionService : SelectionService,
		private activatedRoute: ActivatedRoute) {
		this.subscription = this.selectionService.subscribe(() => {
			this.getSchedules();
		});
	}

	public ngOnDestroy (): void {
		this.subscription.unsubscribe();
	}

	public ngOnInit (): void {
		this.getSchedules();
	}

	public ngAfterViewInit (): void {
		this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) => {
			this.scheduleNode = comps.first.scheduleNode;
		});
	}

	private getSchedules (): void {
		this.isLoaded = false;
		const sectionIds = this.selectionService.getSelectedSectionIds();
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
		let selBox = document.createElement('textarea');
		selBox.style.position = 'fixed';
		selBox.style.left = '0';
		selBox.style.top = '0';
		selBox.style.opacity = '0';
		selBox.value = val;
		document.body.appendChild(selBox);
		selBox.focus();
		selBox.select();
		document.execCommand('copy');
		document.body.removeChild(selBox);
	}

	public copySchedule() {		
		let schedule_link: string = window.location.href + "?section_ids=";

		console.log("start schedule copy");
		const sectionIds = this.selectionService.getSelectedSectionIds();
		console.log(sectionIds);
		
		let num_sections: number = sectionIds.length;
		console.log(num_sections);

		if (num_sections > 0) {
			
			schedule_link += sectionIds[0].toString();

			let i: number;
			for (i = 1; i < num_sections; i++) {
				schedule_link += "," + sectionIds[i].toString();
			}

			this.copyToClipboard(schedule_link);
		}
	}

	public clearSelections (): void {
		this.selectionService.clear();
	}
}

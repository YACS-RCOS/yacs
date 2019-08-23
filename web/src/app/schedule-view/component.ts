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
	notTemporary: boolean = true;
	scheduleNode;

	private subscription;

	constructor (
		private selectionService : SelectionService,
		private router : Router,
		private activatedRoute: ActivatedRoute) {
		this.subscription = this.selectionService.subscribe(() => {
			this.getSchedules();
		});
	}

	public ngOnDestroy (): void {
		this.subscription.unsubscribe();
	}

	public ngOnInit (): void {
		// check if schedule link entered
		console.log("Schedule-view init");

		// angular router url params router.params

		let url: string = window.location.href;
		let i1: number = url.indexOf('schedules?section_ids=');
		let i2: number = url.indexOf('&schedule_index=');
		console.log(url);
		if (i1 != -1) {
			this.selectionService.clear(false);

			console.log("temp schedule init");
			this.notTemporary = false;
			// this.clearSelections();
			console.log(url.indexOf('schedules?section_ids='));
			let end: number = (i2 != -1) ? i2 : url.length;
			const section_ids = url.substring(i1 + 22, end).split(',');//.map(Number);
			console.log(section_ids); // TODO: Remove
		
			let index: number = 0;
			if (i2 != -1) {
				index = parseInt(url.substring(i2 + 16), 10);
			}

			console.log(index); // TODO: Remove
			
			// const store = this.selectionService.getSelectedSectionIds(true);
			// console.log(store);

			Section
			.where({id: section_ids})
			.includes('listing')
			.includes('listing.sections')
			.all().then((sections) => {
				// console.log(sections);
				sections.data.forEach(section => {
					// console.log(section);
					this.selectionService.addSection(section, false);
				});
				this.getSchedules();
			});
		} else {
			this.getSchedules();
		}
		// console.log(this.notTemporary);
		// this.getSchedules();
	}

	public ngAfterViewInit (): void {
		this.ScheduleList.changes.subscribe((comps: QueryList <ScheduleComponent>) => {
			this.scheduleNode = comps.first.scheduleNode;
		});
	}

	private getSchedules (): void {
		this.isLoaded = false;
		const sectionIds = this.selectionService.getSelectedSectionIds(this.notTemporary);
		console.log("getSchedule() sectionIds" + sectionIds);
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
		Section
		.where({id: sectionIds})
		.includes('listing')
		.includes('listing.sections')
		.all().then((sections) => {
			sections.data.forEach(section => {
				this.selectionService.removeSection(section, true);
			});
		});

		// add sections from temporary schedule to currently selected sections
		sectionIds = this.selectionService.getSelectedSectionIds(false);
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

		console.log('Attempting to copy to clipboard: ', schedule_link);

		this.copyToClipboard(schedule_link);
	}

	public clearSelections (): void {
		this.selectionService.clear(this.notTemporary);
	}
}

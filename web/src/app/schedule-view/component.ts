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

  public copyLink() {
    let selectedSectionsStr = this.selectionService.getSelectedSectionIds().join(',');

    let linkToCopy = window.location.protocol + '//'
        + window.location.host
        + '/#/schedules?section_ids=' + selectedSectionsStr
        + '&schedule_index=' + this.scheduleSet.activeScheduleIndex;

    console.log('Attempting to copy to clipboard: ', linkToCopy);

    // Create an element to hold the text to be copied
    let textArea = document.createElement('textarea');
    textArea.value = linkToCopy;

    // Set style to ensure textarea isn't seen by user
    textArea.style.position = 'absolute';
    textArea.style.left = '-1000px';
    textArea.style.top = '-1000px';

    // Append to the DOM as some browsers require this to perform the copy
    document.body.appendChild(textArea);

    // Select the text and tell browser to perform the copy
    textArea.select();
    let sucessfulCopy = document.execCommand('copy');

    if (!sucessfulCopy) {
      console.error('Copying failed!');
    }

    document.body.removeChild(textArea);
  }


  public clearSelections (): void {
    this.selectionService.clear();
  }
}

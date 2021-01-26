import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import { Project } from './project/project-interface';
import { CRUDService } from '../../services/crudservice.service';
import { AutoUnsubscribe } from '../../auto-unsubscribe';
import { TriggerSubjectService } from './trigger-subject';

@AutoUnsubscribe()
@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: [
    './projects.component.css',
    '../styles/editor-style.css',
    '../styles/common-styles.css',
  ],
})
export class ProjectsComponent implements OnInit, OnDestroy {
  public projects: Project[];

  public nextItem: Project;

  public previousItem: Project;

  public selected = 'lastModified';

  private message;

  private subscription;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private trigger: TriggerSubjectService,
  ) {}

  ngOnInit(): void {
    this.getProjects(this.selected);
    this.subscription = this.trigger.getMessage().subscribe((message) => {
      this.message = message;
      if (this.message.text === 'Window is closed') {
        this.getProjects(this.selected);
      }
    });
  }

  private getProjects(sortBy) {
    const orderAsc = sortBy === 'name';
    this.previousItem = null;
    this.nextItem = null;
    this.projects = null;
    this.crud
      .getElementsWithLimit('projects', sortBy, orderAsc, 3)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        this.projects = value.slice(0, 3);
        this.nextItem = value[3];
      });
  }

  public loadNextPage() {
    const orderAsc = this.selected === 'name';
    this.previousItem = this.projects[2];
    this.crud
      .getElementsWithLimit('projects', this.selected, orderAsc, 3, this.nextItem[this.selected])
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        this.projects = value.slice(0, 3);
        this.nextItem = value[3];
      });
  }

  public loadPreviousPage() {
    const orderAsc = this.selected === 'name';
    this.nextItem = this.projects[0];
    this.crud
      .getElementsWithLimit(
        'projects',
        this.selected,
        orderAsc,
        3,
        undefined,
        this.nextItem[this.selected],
      )
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        if (value.length > 3) {
          this.projects = value.slice(1, 4);
          this.previousItem = value[0];
        } else {
          this.previousItem = null;
          this.projects = value;
        }
      });
  }

  public changeSorting(event) {
    this.selected = event.value;
    this.getProjects(event.value);
  }

  public showDialog() {
    this.dialogService.createProject();
  }

  trackByFn(index, item) {
    return item.lastModified;
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}

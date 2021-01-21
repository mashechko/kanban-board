import { Component, DoCheck, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import { Project } from './project/project-interface';
import { CRUDService } from '../../services/crudservice.service';
import { AutoUnsubscribe } from '../../auto-unsubscribe';

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

  private projectId: string;

  private project: Project;

  public nextItem: Project;

  public previousItem: Project;

  public selected = 'lastModified';

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProjects(this.selected, false);
    if (this.router.url.match(/\/projects\/project\/(.+)/)) {
      this.projectId = this.router.url.match(/\/projects\/project\/(.+)/)[1];
      this.getProject();
    }
  }

  private getProjects(sortBy, orderAsc) {
    this.crud
      .getElementsWithLimit('projects', sortBy, orderAsc, 4)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        this.projects = value.slice(0, 3);
        this.nextItem = value[3];
      });
  }

  private getProject() {
    this.crud
      .getElementById('projects', this.projectId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project) => {
        this.project = { id: this.projectId, ...value };
        this.openProject(this.project);
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
    this.previousItem = null;
    if (event.value === 'name') {
      this.getProjects(event.value, true);
    } else {
      this.getProjects(event.value, false);
    }
  }

  private openProject(project) {
    this.dialogService.updateProject(project);
  }

  public showDialog() {
    this.dialogService.createProject();
  }

  trackByFn(index, item) {
    return item.lastModified;
  }

  ngOnDestroy() {}
}

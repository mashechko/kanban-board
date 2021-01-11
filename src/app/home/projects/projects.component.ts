import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { DialogService } from '../../services/dialog.service';
import { Project } from './project/project-interface';
import { CRUDService } from '../../services/crudservice.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css', '../styles/editor-style.css'],
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];

  public nextItem: Project;

  public previousItem: Project;

  public selected = 'lastModified';

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getProjects(this.selected, false);
  }

  private getProjects(sortBy, orderAsc) {
    this.previousItem = null;
    this.crud
      .getElementsWithLimit('projects', sortBy, orderAsc, 3)
      .subscribe((value: Project[]) => {
        this.projects = value.slice(0, 3);
        // eslint-disable-next-line prefer-destructuring
        this.nextItem = value[3];
      });
  }

  public loadNextPage() {
    const orderAcs = this.selected === 'name';

    let startAt: any;
    switch (this.selected) {
      case 'lastModified':
        startAt = this.nextItem.lastModified;
        break;
      case 'name':
        startAt = this.nextItem.name;
        break;
      case 'created':
        startAt = this.nextItem.created;
        break;
      default:
        startAt = this.nextItem.lastModified;
    }
    // eslint-disable-next-line prefer-destructuring
    // this.previousItem = this.projects[2];
    this.crud
      .getElementsWithLimit('projects', this.selected, orderAcs, 3, startAt)
      .subscribe((value: Project[]) => {
        // eslint-disable-next-line prefer-destructuring
        this.previousItem = value[0];
        this.projects = value.slice(0, 3);
        // eslint-disable-next-line prefer-destructuring
        this.nextItem = value[3];
      });
  }

  public loadPreviousPage() {
    const orderAcs = this.selected === 'name';

    let endAt: any;
    switch (this.selected) {
      case 'lastModified':
        endAt = this.previousItem.lastModified;
        break;
      case 'name':
        endAt = this.previousItem.name;
        break;
      case 'created':
        endAt = this.previousItem.created;
        break;
      default:
        endAt = this.previousItem.lastModified;
    }
    // eslint-disable-next-line prefer-destructuring
    this.crud
      .getElementsWithLimit('projects', this.selected, orderAcs, 3, undefined, endAt)
      .subscribe((value: Project[]) => {
        // eslint-disable-next-line prefer-destructuring
        this.previousItem = value[0];
        this.projects = value.slice(0, 3);
        // eslint-disable-next-line prefer-destructuring
        this.nextItem = value[3];
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

  public showDialog() {
    this.dialogService.createProject();
  }

  trackByFn(index, item) {
    return item.lastModified;
  }
}

import { Component, OnInit } from '@angular/core';
import { NotificationsService } from 'angular2-notifications';
import { Router } from '@angular/router';
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

  public projectsToShow: Project[];

  private projectId: string;

  private project: Project;

  public currentPage: number;

  public pagesAmount: number;

  public selected = 'lastModified';

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.getProjects(this.selected, false);
    if (this.router.url.match(/\/projects\/project\/(.+)/)) {
      // eslint-disable-next-line prefer-destructuring
      this.projectId = this.router.url.match(/\/projects\/project\/(.+)/)[1];
      this.getProject();
    }
  }

  private getProjects(sortBy, orderAsc) {
    this.crud.getCollectionWithOrder('projects', sortBy, orderAsc).subscribe((value: Project[]) => {
      this.projects = value;
      this.projectsToShow = this.projects.slice(0, 3);
      this.currentPage = 1;
      if (this.projects.length % 3) {
        this.pagesAmount = Math.ceil(this.projects.length / 3);
      } else {
        this.pagesAmount = this.projects.length / 3;
      }
    });
  }

  private getProject() {
    this.crud.getElementById('projects', this.projectId).subscribe((value: Project) => {
      this.project = { id: this.projectId, ...value };
      this.openProject(this.project);
    });
  }

  public loadNextPage() {
    this.currentPage += 1;
    this.projectsToShow = this.projects.slice((this.currentPage - 1) * 3, this.currentPage * 3);
  }

  public loadPreviousPage() {
    this.currentPage -= 1;
    this.projectsToShow = this.projects.slice((this.currentPage - 1) * 3, this.currentPage * 3);
  }

  public changeSorting(event) {
    this.currentPage = 1;
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
}

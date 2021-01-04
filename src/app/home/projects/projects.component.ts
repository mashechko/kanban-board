import { Component, OnInit } from '@angular/core';
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

  public lastItem: Project;

  public previousItems = [];

  public selected = 'sort by last modification';

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getProjects('lastModified');
  }

  private getProjects(sortBy) {
    this.crud.getElementsWithLimit('projects', sortBy, false, 3).subscribe((value: Project[]) => {
      this.projects = value.slice(0, 3);
      // eslint-disable-next-line prefer-destructuring
      this.lastItem = value[3];
    });
  }

  public loadNextPage() {
    this.previousItems.push(...this.projects);
    this.crud
      .getElementsWithLimit('projects', 'lastModified', false, 3, this.lastItem.lastModified)
      .subscribe((value: Project[]) => {
        this.projects = value.slice(0, 3);
        // eslint-disable-next-line prefer-destructuring
        this.lastItem = value[3];
      });
  }

  public loadPreviousPage() {
    // eslint-disable-next-line prefer-destructuring
    this.lastItem = this.projects[0];
    this.projects = this.previousItems.splice(this.previousItems.length - 3, 3);
  }

  public changeSorting(event) {
    this.getProjects(event.value);
  }

  public showDialog() {
    this.dialogService.createProject();
  }

  trackByFn(index, item) {
    return item.lastModified;
  }
}

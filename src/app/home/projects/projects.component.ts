import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Project } from './project/project-interface';
import { CRUDService } from '../../services/crudservice.service';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.css'],
})
export class ProjectsComponent implements OnInit {
  public projects: Project[];

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getProjects();
  }

  private getProjects() {
    this.crud.getCollection('projects').subscribe((value: Project[]) => {
      this.projects = value;
    });
  }

  public showDialog() {
    this.dialogService.createProject();
  }
}

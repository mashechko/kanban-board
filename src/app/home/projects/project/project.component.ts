import { Component, Input, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';
import { Project } from './project-interface';
import { User } from '../../../user-interface';
import { CRUDService } from '../../../services/crudservice.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  @Input() project: Project;

  public createdBy: User;

  public developers: User[];

  public devPreview: User[];

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getCreator();
    this.getSelectedDevs();
  }

  public showDialog(project) {
    this.dialogService.updateProject(project);
  }

  private getCreator() {
    this.crud.getElementById('users', this.project.createdBy).subscribe((value: User) => {
      this.createdBy = value;
    });
  }

  private getSelectedDevs() {
    this.crud
      .getElementsOfArray('users', 'uid', this.project.selectedDevs.slice(0, 3))
      .subscribe((value: User[]) => {
        this.devPreview = value;
      });
  }
}

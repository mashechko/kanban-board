import { Component, OnInit } from '@angular/core';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit {
  constructor(private dialogService: DialogService) {}

  ngOnInit(): void {}

  public showDialog(project) {
    this.dialogService.updateProject(project);
  }
}

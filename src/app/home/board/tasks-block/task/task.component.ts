import { Component, Input, OnInit } from '@angular/core';
import firebase from 'firebase';
import { DialogService } from '../../../../services/dialog.service';
import { Task } from './task-interface';
import { CRUDService } from '../../../../services/crudservice.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;

  public devPhotoURL: string;

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    if (this.task.assignedTo) {
      this.getUserPhoto();
    }
  }

  public showDialog(task) {
    this.dialogService.updateTask(task);
  }

  public getUserPhoto(): void {
    this.crud.getElementById('users', this.task.assignedTo).subscribe((value: firebase.User) => {
      this.devPhotoURL = value.photoURL;
    });
  }
}

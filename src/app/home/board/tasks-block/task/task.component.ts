import { Component, Input, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import { TaskService } from '../../../../services/task.service';
import { Task } from './task-interface';
import { CRUDService } from '../../../../services/crudservice.service';
import { User } from '../../../../user-interface';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;

  public devPhotoURL: string;

  constructor(private taskService: TaskService, private crud: CRUDService) {}

  ngOnInit(): void {
    if (this.task.assignedTo) {
      this.getUserPhoto();
    }
  }

  public showDialog(task) {
    this.taskService.updateTask(task);
  }

  public getUserPhoto(): void {
    this.crud.getElementById('users', this.task.assignedTo).subscribe((value: firebase.User) => {
      this.devPhotoURL = value.photoURL;
    });
  }
}

import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import firebase from 'firebase';
import { TaskEditorComponent } from '../home/board/task-editor/task-editor.component';
import { AuthService } from './auth.service';
import { StoreService } from './store.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(public dialog: MatDialog, private storeService: StoreService) {}

  public createTask(taskStatus) {
    const taskInfo = {
      status: taskStatus,
      created: new Date().getTime(),
      createdBy: this.storeService.user.displayName,
      comments: [],
      tags: [],
      priority: 'Low Priority',
    };
    this.dialog.open(TaskEditorComponent, {
      data: {
        taskInfo,
      },
      width: '1200px',
      height: '675px',
      hasBackdrop: true,
      disableClose: true,
    });
  }

  public updateTask(task) {
    const taskInfo = task;
    this.dialog.open(TaskEditorComponent, {
      data: {
        taskInfo,
      },
      width: '1200px',
      height: '675px',
      hasBackdrop: true,
      disableClose: true,
    });
  }
}

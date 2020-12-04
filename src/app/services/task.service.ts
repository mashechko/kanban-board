import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TaskEditorComponent } from '../task-editor/task-editor.component';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  constructor(public dialog: MatDialog) {}

  showDialog(task) {
    let taskInfo = {};
    if (typeof task === 'string') {
      taskInfo = {
        status: task,
        created: new Date(),
      };
    } else {
      taskInfo = task;
    }
    this.dialog.open(TaskEditorComponent, {
      data: {
        taskInfo,
      },
      width: '1200px',
      height: '650px',
      hasBackdrop: false,
      disableClose: false,
    });
  }
}

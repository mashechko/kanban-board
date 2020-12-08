import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map } from 'rxjs/operators';
import { TaskEditorComponent } from '../task-editor/task-editor.component';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public user: string;

  constructor(public dialog: MatDialog, public auth: AuthService) {}

  private getCurrentUser() {
    return this.auth.user$.pipe(map((value) => value.displayName));
  }

  public createTask(taskStatus, user) {
    const taskInfo = {
      status: taskStatus,
      created: new Date().getTime(),
      createdBy: user,
    };
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

  public updateTask(task) {
    const taskInfo = task;
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

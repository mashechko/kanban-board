import { MatDialog } from '@angular/material/dialog';
import { Injectable } from '@angular/core';
import { TaskEditorComponent } from '../home/board/task-editor/task-editor.component';
import { ProjectEditorComponent } from '../home/projects/project-editor/project-editor.component';
import { StoreService } from './store.service';

@Injectable()
export class DialogService {
  constructor(public dialog: MatDialog, private storeService: StoreService) {}

  public createTask(taskStatus) {
    const taskInfo = {
      status: taskStatus,
      created: new Date().getTime(),
      createdBy: this.storeService.user.displayName,
      comments: [],
      tags: [],
      imageLinks: [],
      openBy: [],
      priority: 'Low Priority',
      isChanging: false,
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

  public createProject() {
    const projectInfo = {
      created: new Date().getTime(),
      createdBy: this.storeService.user.uid,
      selectedDevs: [this.storeService.user.uid],
    };
    this.dialog.open(ProjectEditorComponent, {
      data: {
        projectInfo,
      },
      width: '1200px',
      height: '675px',
      hasBackdrop: true,
      disableClose: true,
    });
  }

  public updateProject(project) {
    const projectInfo = project;
    this.dialog.open(ProjectEditorComponent, {
      data: {
        projectInfo,
      },
      width: '1200px',
      height: '675px',
      hasBackdrop: true,
      disableClose: true,
    });
  }
}

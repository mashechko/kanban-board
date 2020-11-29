import { Injectable } from '@angular/core';
import {TaskEditorComponent} from './task-editor/task-editor.component';
import {MatDialog} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(public dialog: MatDialog) { }

  showDialog(){
    this.dialog.open(TaskEditorComponent, {
      width: '1200px',
      height: '650px',
      hasBackdrop: false,
      disableClose: false
    });
  }
}

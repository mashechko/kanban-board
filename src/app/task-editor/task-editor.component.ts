import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Task} from '../task-interface';
import {CRUDService} from '../crudservice.service';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {
  task: Task = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<TaskEditorComponent>,
    public crud: CRUDService) {
    this.task = {...data.taskInfo};
  }
  public save(task) {
    if (task.id) {
      this.crud.updateObject('Tasks', task.id, task);
      this.dialogRef.close();
    } else {
      this.crud.createEntity('Tasks', task);
      this.dialogRef.close();
    }
  }

  public delete(task) {
    this.crud.deleteObject('Tasks', task.id);
    this.dialogRef.close();
  }

  ngOnInit(): void {
  }

}

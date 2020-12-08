import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Task } from '../task-interface';
import { CRUDService } from '../services/crudservice.service';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css'],
})
export class TaskEditorComponent implements OnInit {
  public task: Task = null;

  public developers: object[];

  private statuses: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  formGr: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    public dialogRef: MatDialogRef<TaskEditorComponent>,
    public crud: CRUDService,
    private fb: FormBuilder,
  ) {
    this.task = { ...data.taskInfo };
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

  public changeStatus(task) {
    if (task.status !== this.statuses[3]) {
      // eslint-disable-next-line no-param-reassign
      task.status = this.statuses[this.statuses.indexOf(task.status) + 1];
      this.crud.updateObject('Tasks', task.id, task);
    }
  }

  private getDevelopers() {
    return this.crud.getCollection('users').subscribe((developers: object[]) => {
      this.developers = developers;
    });
  }

  onSubmit() {
    const { controls } = this.formGr;

    if (this.formGr.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      return;
    }
    this.task.name = this.formGr.controls.name.value;
    this.task.info = this.formGr.controls.info.value;
    this.task.dueDate = this.formGr.controls.dueDate.value;
    this.task.priority = this.formGr.controls.priority.value;
    this.task.assignedTo = this.formGr.controls.assignedTo.value;

    this.save(this.task);
  }

  isControlInvalid(controlName: string): string {
    const control = this.formGr.controls[controlName];

    const result = control.invalid && control.touched;

    if (result) {
      return 'error';
    }
    return 'valid';
  }

  private initForm() {
    this.formGr = this.fb.group({
      name: [this.task.name, [Validators.required]],
      info: this.task.info,
      dueDate: this.task.dueDate,
      priority: this.task.priority,
      assignedTo: this.task.assignedTo,
    });
  }

  ngOnInit(): void {
    this.initForm();
    this.getDevelopers();
  }
}

import { Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { map } from 'rxjs/operators';
import { Task } from '../tasks-block/task/task-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { AuthService } from '../../../services/auth.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';
import { TagInterface } from '../tags/tag-interface';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css'],
})
export class TaskEditorComponent implements OnInit, OnDestroy {
  public task: Task = null;

  public user: string;

  public developers: object[];

  public tags: TagInterface[];

  private statuses: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  formGr: FormGroup;

  public openTagWindow = false;

  public openNewTagWindow = false;

  public tagColors = ['#ee4d4d', '#ff8b3a', '#679f50', '#2f60fd', '#662ffd', '#da71de', '#ff0303'];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<TaskEditorComponent>,
    private crud: CRUDService,
    private fb: FormBuilder,
    private auth: AuthService,
  ) {
    this.task = { ...data.taskInfo };
  }

  @ViewChild('inputElementComment')
  public commentElement: ElementRef;

  @ViewChild('inputElementTag')
  public tagElement: ElementRef;

  ngOnInit(): void {
    this.initForm();
    this.getCurrentUser();
    this.getDevelopers();
    this.getTags();
  }

  private getCurrentUser() {
    return this.auth.user$.pipe(map((value) => value.displayName)).subscribe((user) => {
      this.user = user;
    });
  }

  public save(task) {
    if (task.id) {
      this.crud.updateObject('Tasks', task.id, task);
      this.dialogRef.close();
    } else {
      this.addComment(`${this.task.createdBy} created this task`);
      this.crud.createEntity('Tasks', task);
      this.dialogRef.close();
    }
  }

  public delete(task) {
    this.crud.deleteObject('Tasks', task.id);
    this.dialogRef.close();
  }

  public changeStatus(task) {
    if (task.status !== this.statuses[3] && task.id) {
      // eslint-disable-next-line no-param-reassign
      task.status = this.statuses[this.statuses.indexOf(task.status) + 1];
      this.addComment(`${this.user} changed status to "${task.status}"`);
      this.crud.updateObject('Tasks', task.id, task);
    }
  }

  public addComment(comment?) {
    if (comment) {
      this.task.comments.push(comment);
    } else if (this.commentElement.nativeElement.value.length) {
      this.task.comments.push(`${this.user} commented: ${this.commentElement.nativeElement.value}`);
      this.commentElement.nativeElement.value = '';
    }
  }

  private getDevelopers() {
    return this.crud.getCollection('users').subscribe((developers: object[]) => {
      this.developers = developers;
    });
  }

  public setDev(dev) {
    this.task.comments.push(`${this.user} assigned this task to ${dev.target.value}`);
  }

  private getTags() {
    this.crud
      .getCollection('tags')
      .pipe(
        map((value: TagInterface[]) => {
          this.tags = value;
        }),
      )
      .subscribe();
  }

  public toggle(window) {
    if (window === 'TagWindow') {
      this.openTagWindow = !this.openTagWindow;
    } else if (window === 'NewTagWindow') {
      this.openNewTagWindow = !this.openNewTagWindow;
    }
  }

  public addTag(tag) {
    if (this.task.tags.indexOf(tag) === -1) {
      this.task.tags.push(tag);
    }
  }

  public removeTag(tagID) {
    this.task.tags.splice(this.task.tags.indexOf(tagID), 1);
  }

  addNewTag(tagColor) {
    if (this.tagElement.nativeElement.value.length) {
      const tagName = this.tagElement.nativeElement.value;
      this.crud.createEntity('tags', { name: tagName, background: tagColor });
    }
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

  isControlInvalid(controlName: string): boolean {
    const control = this.formGr.controls[controlName];

    const result = control.invalid && control.touched;

    return result;
  }

  private initForm() {
    this.formGr = this.fb.group({
      name: [this.task.name, [Validators.required]],
      info: [this.task.info, Validators.maxLength(1000)],
      dueDate: this.task.dueDate,
      priority: this.task.priority,
      assignedTo: this.task.assignedTo,
    });
  }

  ngOnDestroy(): void {}
}

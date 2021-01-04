import {
  AfterContentInit,
  Component,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeWhile } from 'rxjs/operators';
import firebase from 'firebase';
import { combineLatest } from 'rxjs';
import { Task } from '../tasks-block/task/task-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';
import { TagInterface } from '../tags/tag/tag-interface';
import { StoreService } from '../../../services/store.service';
import { UploadService } from '../../../services/upload.service';
import { CommentInterface } from './comment/comment-interface';
import { User } from '../../../user-interface';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css', '../../styles/editor-style.css'],
})
export class TaskEditorComponent implements OnInit, OnDestroy, AfterContentInit {
  public task: Task = null;

  public user: User;

  public developers: firebase.User[];

  public selectedDevs: firebase.User[];

  public tags: TagInterface[] = [];

  private statuses: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  formGr: FormGroup;

  public showImage = false;

  public minDate: Date;

  public progress: string;

  public imageLinks: string[];

  private timeoutId;

  private commentId: string;

  public comments: object[];

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<TaskEditorComponent>,
    private crud: CRUDService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private uploadService: UploadService,
  ) {
    this.task = { ...data.taskInfo };
  }

  @ViewChild('inputElementComment')
  public commentElement: ElementRef;

  @HostListener('click')
  handleClick() {
    this.closeIfInactive();
  }

  @HostListener('window:keydown')
  handleKeydown() {
    this.closeIfInactive();
  }

  ngOnInit(): void {
    this.initForm();
    this.getDevelopers();
    if (this.task.comments.length) {
      this.getComments();
    }
    if (this.task.tags.length) {
      this.getTags();
    }
    this.user = this.storeService.user;
    this.minDate = new Date();
    this.closeIfInactive();
  }

  ngAfterContentInit() {
    if (this.task.id && !this.task.isChanging) {
      this.task.isChanging = true;
      this.crud.updateObject('Tasks', this.task.id, this.task);
    }
  }

  private getDevelopers() {
    return this.crud.getCollection('users').subscribe((developers: firebase.User[]) => {
      this.developers = developers;
      this.selectedDevs = developers;
    });
  }

  private getComments() {
    this.crud
      .getElementsByProperty('comments', 'taskId', this.task.id, 'date')
      .subscribe((value: CommentInterface[]) => {
        this.comments = value;
      });
  }

  private getTags() {
    this.crud
      .getElementsOfArray('tags', 'id', this.task.tags)
      .subscribe((value: TagInterface[]) => {
        this.tags = value;
      });
  }

  public save(task) {
    // eslint-disable-next-line no-param-reassign
    task.lastModified = new Date().getTime();
    if (task.id) {
      // eslint-disable-next-line no-param-reassign
      task.isChanging = false;
      this.crud.updateObject('Tasks', task.id, task);
      this.dialogRef.close();
    } else {
      this.crud.createEntity('Tasks', task).subscribe((value) => {
        this.addComment({
          content: `${this.task.createdBy} created this task`,
          type: 'comment',
          taskId: value,
          date: new Date().getTime(),
        });
      });
      this.dialogRef.close();
    }
  }

  public delete(task) {
    this.crud.deleteObject('Tasks', task.id);
    this.task.id = null;
    this.dialogRef.close();
  }

  public changeStatus(task) {
    if (task.status !== this.statuses[3] && task.id) {
      // eslint-disable-next-line no-param-reassign
      task.status = this.statuses[this.statuses.indexOf(task.status) + 1];
      this.addComment({
        content: `${this.user.displayName} changed status to ${task.status}`,
        type: 'status',
        taskId: this.task.id,
        date: new Date().getTime(),
      });
      this.crud.updateObject('Tasks', task.id, task);
    }
  }

  public addComment(comment?) {
    if (comment) {
      this.crud.createEntity('comments', comment).subscribe((value) => {
        this.commentId = value;
        this.task.comments.push(this.commentId);
        this.crud.updateObject('Tasks', comment.taskId, this.task);
      });
    } else if (this.commentElement.nativeElement.value.length) {
      const commentData = {
        content: `${this.user.displayName} commented: ${this.commentElement.nativeElement.value}`,
        type: 'comment',
        taskId: this.task.id,
        date: new Date().getTime(),
      };
      this.crud.createEntity('comments', commentData).subscribe((value) => {
        this.commentId = value;
        this.task.comments.push(this.commentId);
      });
      this.commentElement.nativeElement.value = '';
    }
  }

  public onKey(event) {
    this.selectedDevs = this.search(event.target.value);
  }

  private search(value: string) {
    const filter = value.toLowerCase();
    return this.developers.filter((option: firebase.User) =>
      option.displayName.toLowerCase().includes(filter),
    );
  }

  public setDev(dev) {
    let devName: string;
    this.crud.getElementById('users', dev.value).subscribe((value: firebase.User) => {
      devName = value.displayName;
      const commentData = {
        content: `${this.user.displayName} assigned this task to ${devName}`,
        type: 'comment',
        taskId: this.task.id,
        date: new Date().getTime(),
      };
      this.addComment(commentData);
    });
  }

  public setPriority(priprity) {
    console.log(priprity);
    const commentData = {
      content: `${this.user.displayName} changed task priority to ${priprity.target.value}`,
      type: 'status',
      taskId: this.task.id,
      date: new Date().getTime(),
    };
    this.addComment(commentData);
  }

  public toggle(window) {
    if (window === 'ImageWindow') {
      this.showImage = !this.showImage;
    }
  }

  public addTag(tag) {
    if (this.task.tags.indexOf(tag.id) === -1) {
      this.task.tags.push(tag.id);
    }
  }

  public removeTag(tagID) {
    this.task.tags.splice(this.task.tags.indexOf(tagID), 1);
  }

  public onFileSelected(event): void {
    const file = event.target.files[0];
    combineLatest(this.uploadService.uploadFileAndGetMetadata('test', file))
      .pipe(
        takeWhile(([, link]) => {
          return !link;
        }, true),
      )
      .subscribe(([percent, link]) => {
        this.progress = percent;
        if (link) {
          this.task.imageLinks.push(link);
        }
      });
  }

  onSubmit() {
    const { controls } = this.formGr;

    if (this.formGr.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      return;
    }

    this.task.name = controls.name.value;
    this.task.info = controls.info.value;
    this.task.dueDate = controls.dueDate.value ? controls.dueDate.value.getTime() : null;
    this.task.priority = controls.priority.value;
    this.task.assignedTo = controls.assignedTo.value;

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
      dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
      priority: this.task.priority,
      assignedTo: this.task.assignedTo,
    });
    if (this.task.isChanging) {
      this.formGr.disable();
    }
  }

  private closeIfInactive() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
    this.timeoutId = setTimeout(() => {
      this.save(this.task);
    }, 600000000);
  }

  ngOnDestroy(): void {
    if (this.task.id) {
      this.task.isChanging = false;
      this.crud.updateObject('Tasks', this.task.id, this.task);
    }
    clearTimeout(this.timeoutId);
  }
}

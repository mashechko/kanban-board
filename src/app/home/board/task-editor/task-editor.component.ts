import {
  Component,
  DoCheck,
  ElementRef,
  HostListener,
  Inject,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { takeUntil, takeWhile } from 'rxjs/operators';
import firebase from 'firebase';
import { combineLatest, Subject } from 'rxjs';
import { NotificationsService } from 'angular2-notifications';
import { Task } from '../tasks-block/task/task-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';
import { TagInterface } from '../tags/tag/tag-interface';
import { StoreService } from '../../../services/store.service';
import { UploadService } from '../../../services/upload.service';
import { CommentInterface } from './comment/comment-interface';
import { User } from '../../../user-interface';
import { Project } from '../../projects/project/project-interface';
import { noWhitespaceValidator } from '../../trim-validator';
import { STATUSES } from '../../STATUSES';

@AutoUnsubscribe()
@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css', '../../styles/editor-style.css'],
})
export class TaskEditorComponent implements OnInit, DoCheck, OnDestroy {
  public task: Task = null;

  public user: User;

  public developers: User[];

  public selectedDevs: User[];

  public tags: TagInterface[] = [];

  private statuses: string[] = STATUSES;

  formGr: FormGroup;

  public showImage = false;

  public minDate: Date;

  public progress: string;

  public imageLinks: string[];

  private timeoutId;

  private commentId: string;

  public comments: object[];

  public projects: Project[];

  private openBy: string;

  public taskLink: string;

  private taskSubscription;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<TaskEditorComponent>,
    private crud: CRUDService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private uploadService: UploadService,
    private notification: NotificationsService,
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

  @HostListener('window:beforeunload')
  beforeunloadHandler(event) {
    return false;
  }

  ngOnInit(): void {
    this.user = this.storeService.user;
    this.getUserData();
    this.initForm();
    this.minDate = new Date();
    this.closeIfInactive();
    if (this.task.id) {
      this.getTask();
    }
    if (this.task.comments.length) {
      this.getComments();
    }
  }

  ngDoCheck() {
    this.taskLink = window.location.href;
  }

  private getTask() {
    this.taskSubscription = this.crud
      .getElementsByProperty('Tasks', 'id', this.task.id, 'lastModified')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task[]) => {
        this.task = value[0];
        if (!this.task.openBy) {
          this.initForm();
        }
      });
  }

  getUserData() {
    this.crud
      .getElementById('users', this.user.uid)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        this.user = value;
        if (this.user.projects) {
          if (this.user.projects.length) {
            this.getProjects();
          }
        }
      });
  }

  public getDevelopers(projectId) {
    let project: Project;
    this.projects.forEach((value) => {
      if (value.id === projectId.value) {
        project = value;
        this.crud
          .getElementsOfArray('users', 'uid', project.selectedDevs)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe((developers: firebase.User[]) => {
            this.developers = developers;
            this.selectedDevs = developers;
          });
      }
    });
  }

  private getComments() {
    this.crud
      .getElementsByProperty('comments', 'taskId', this.task.id, 'date')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: CommentInterface[]) => {
        this.comments = value;
      });
  }

  private getProjects() {
    this.crud
      .getElementsOfArray('projects', 'id', this.user.projects)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        this.projects = value;
        if (this.task.projectId) {
          this.getDevelopers({ value: this.task.projectId });
        }
      });
  }

  public checkProjectNumber() {
    if (!this.projects) {
      this.dropNotification(
        'No projects available. Create a project before adding a task.',
        'warn',
      );
    } else if (!this.projects.length) {
      this.dropNotification(
        'No projects available. Create a project before adding a task.',
        'warn',
      );
    }
  }

  public save(task) {
    task.lastModified = new Date().getTime();
    if (task.id) {
      if (this.user.uid === this.task.openBy) {
        this.task.openBy = null;
        this.task.isChanging = false;
        this.taskSubscription.unsubscribe();
      }
      this.crud
        .updateObject('Tasks', task.id, task)
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe();
      this.dialogRef.close();
    } else {
      this.crud.createEntity('Tasks', task).subscribe((value) => {
        this.addComment({
          content: `${this.task.createdBy} created this task`,
          type: 'comment',
          taskId: value,
          date: new Date().getTime(),
        });
        if (this.task.assignedTo) {
          let developer: User;
          this.developers.forEach((dev) => {
            if (dev.uid === this.task.assignedTo) {
              developer = dev;
            }
          });
          const commentData = {
            content: `${this.user.displayName} assigned this task to ${developer.displayName}`,
            type: 'comment',
            taskId: value,
            date: new Date().getTime(),
          };
          this.addComment(commentData);
        }
      });
      this.dialogRef.close();
    }
  }

  public delete(task) {
    if (this.task.openBy === this.user.uid) {
      this.deleteComments();
      if (task.imageLinks.length) {
        this.deleteImages();
      }
      this.crud.deleteObject('Tasks', task.id).subscribe();
      this.task.id = null;
      this.dialogRef.close();
    } else {
      this.dropNotification('You cannot delete this task while other user is modifying it', 'warn');
    }
    this.taskSubscription.unsubscribe();
  }

  private deleteComments() {
    this.comments.forEach((comment: CommentInterface) => {
      this.crud.deleteObject('comments', comment.id).subscribe();
    });
  }

  private deleteImages() {
    this.task.imageLinks.forEach((link) => {
      this.uploadService.deleteFile(link);
    });
  }

  public changeStatus(task, direction) {
    if (task.id) {
      if (this.task.openBy !== this.user.uid) {
        this.dropNotification(
          'You cannot change task status while other user is modifying it',
          'warn',
        );
      } else if (direction === 'next' && task.status !== this.statuses[3]) {
        task.status = this.statuses[this.statuses.indexOf(task.status) + 1];
        this.addComment({
          content: `${this.user.displayName} changed status to ${task.status}`,
          type: 'status',
          taskId: this.task.id,
          date: new Date().getTime(),
        });
        this.crud
          .updateObject('Tasks', task.id, task)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      } else if (direction === 'previous' && task.status !== this.statuses[0]) {
        task.status = this.statuses[this.statuses.indexOf(task.status) - 1];
        this.addComment({
          content: `${this.user.displayName} changed status to ${task.status}`,
          type: 'status',
          taskId: this.task.id,
          date: new Date().getTime(),
        });
        this.crud
          .updateObject('Tasks', task.id, task)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      }
    }
  }

  public addComment(comment?) {
    if (comment) {
      this.crud.createEntity('comments', comment).subscribe((value) => {
        this.commentId = value;
        this.task.comments.push(this.commentId);
        this.crud
          .updateObject('Tasks', comment.taskId, this.task)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
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
    if (this.task.id) {
      let developer: User;
      this.developers.forEach((value) => {
        if (value.uid === dev.value) {
          developer = value;
        }
      });
      const commentData = {
        content: `${this.user.displayName} assigned this task to ${developer.displayName}`,
        type: 'comment',
        taskId: this.task.id,
        date: new Date().getTime(),
      };
      this.addComment(commentData);
    }
  }

  public setPriority(priority) {
    const commentData = {
      content: `${this.user.displayName} changed task priority to ${priority.target.value}`,
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

  public dropNotification(content, type) {
    const title = 'Warning';

    const temp = {
      type,
      title: 'Warning',
      content,
      timeOut: 5000,
      showProgressBar: true,
      pauseOnHover: true,
      clickToClose: true,
      animate: 'fromRight',
    };

    // @ts-ignore
    this.notification.create(title, content, type, temp);
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
    this.task.projectId = controls.projectId.value;

    this.save(this.task);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGr.controls[controlName];

    const result = control.invalid && control.touched;

    return result;
  }

  private initForm() {
    this.formGr = this.fb.group({
      name: [this.task.name, [Validators.required, noWhitespaceValidator]],
      info: [this.task.info, Validators.maxLength(1000)],
      projectId: [this.task.projectId, [Validators.required]],
      dueDate: this.task.dueDate ? new Date(this.task.dueDate) : null,
      priority: this.task.priority,
      assignedTo: this.task.assignedTo,
    });

    if (this.task.id) {
      if (!this.task.openBy) {
        this.task.openBy = this.user.uid;
        this.task.isChanging = true;
        setTimeout(() => this.formGr.enable());
        this.crud
          .updateObject('Tasks', this.task.id, this.task)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      } else if (this.task.openBy !== this.user.uid) {
        setTimeout(() => this.formGr.disable());
        setTimeout(() => {
          this.dropNotification('This task is modifying by other user', 'warn');
        }, 1000);
        this.crud
          .updateObject('Tasks', this.task.id, this.task)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      }
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
    if (this.openBy === this.user.uid) {
      this.openBy = null;
    }
    clearTimeout(this.timeoutId);
  }
}

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import firebase from 'firebase';
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../../../services/dialog.service';
import { Task } from './task-interface';
import { CRUDService } from '../../../../services/crudservice.service';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit, OnDestroy {
  @Input() task: Task;

  public devPhotoURL: string;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private notification: NotificationsService,
  ) {}

  ngOnInit(): void {
    if (this.task.assignedTo) {
      this.getUserPhoto();
    }
  }

  public showDialog(task) {
    if (task.isDragging) {
      this.dropNotification('This task is dragging by other user', 'warn');
    } else {
      this.dialogService.updateTask(task);
    }
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

  public getUserPhoto(): void {
    this.crud
      .getElementById('users', this.task.assignedTo)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: firebase.User) => {
        this.devPhotoURL = value.photoURL;
      });
  }

  ngOnDestroy(): void {}
}

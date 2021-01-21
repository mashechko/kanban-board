import { Component, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../services/dialog.service';
import { Task } from './tasks-block/task/task-interface';
import { CRUDService } from '../../services/crudservice.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../user-interface';
import { STATUSES } from '../STATUSES';
import { AutoUnsubscribe } from '../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css', '../styles/common-styles.css'],
})
export class BoardComponent implements OnInit, OnChanges, OnDestroy {
  public tasks: Task[];

  public user: User;

  private taskId: string;

  private task: Task;

  public sortedTasks = null;

  public statuses: string[] = STATUSES;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private storeService: StoreService,
    private router: Router,
  ) {}

  ngOnInit() {
    this.user = this.storeService.user;
    this.getUserData();
    if (this.router.url.match(/\/board\/task\/(.+)/)) {
      this.taskId = this.router.url.match(/\/board\/task\/(.+)/)[1];
      this.getTask();
    }
  }

  ngOnChanges(changes): void {
    this.sortTasks();
  }

  private sortTasks() {
    this.sortedTasks = {
      'ready to dev': [],
      'in development': [],
      'in qa': [],
      closed: [],
    };
    this.tasks.forEach((task) => {
      switch (task.status) {
        case 'ready to dev':
          this.sortedTasks['ready to dev'].push(task);
          break;
        case 'in development':
          this.sortedTasks['in development'].push(task);
          break;
        case 'in qa':
          this.sortedTasks['in qa'].push(task);
          break;
        case 'closed':
          this.sortedTasks.closed.push(task);
          break;
        default:
          this.sortedTasks['ready to dev'].push(task);
      }
    });
  }

  private getUserData() {
    this.crud
      .getElementById('users', this.user.uid)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        this.user = value;
        if (this.user.projects && this.user.projects.length) {
          this.getTasks();
        }
      });
  }

  private getTasks() {
    this.crud
      .getSortedElementsOfArray('Tasks', 'projectId', this.user.projects, 'lastModified', false)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task[]) => {
        this.tasks = value;
        this.sortTasks();
      });
  }

  private getTask() {
    this.crud
      .getElementById('Tasks', this.taskId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task) => {
        this.task = value;
        if (this.task) {
          this.openTask(this.task);
        } else {
          this.router.navigate(['']);
        }
      });
  }

  private openTask(task) {
    this.dialogService.updateTask(task);
  }

  public showDialog(status) {
    this.dialogService.createTask(status);
  }

  ngOnDestroy(): void {}
}

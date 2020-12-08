import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TaskService } from '../services/task.service';
import { CRUDService } from '../services/crudservice.service';
import { AutoUnsubscribe } from '../auto-unsubscribe';
import { AuthService } from '../services/auth.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css'],
})
export class TasksBlockComponent implements OnInit, OnDestroy {
  @Input() column: string;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  public tasks: unknown[];

  public user: string;

  constructor(
    private taskService: TaskService,
    private crud: CRUDService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    this.getTasks(this.column);
    this.getCurrentUser();
  }

  public showDialog(status, user) {
    this.taskService.createTask(status, user);
  }

  public getTasks(status) {
    this.crud
      .getElementsByProperty('Tasks', 'status', status)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }

  private getCurrentUser() {
    return this.auth.user$.pipe(map((value) => value.displayName)).subscribe((user) => {
      this.user = user;
    });
  }

  ngOnDestroy(): void {}
}

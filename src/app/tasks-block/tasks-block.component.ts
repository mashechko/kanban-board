import { Component, Input, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TaskService } from '../services/task.service';
import { CRUDService } from '../services/crudservice.service';
import { AutoUnsubscribe } from '../auto-unsubscribe';
import { AutoUnsubscribeBase } from '../auto-unsubscribe-base';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css'],
})
export class TasksBlockComponent extends AutoUnsubscribeBase implements OnInit {
  @Input() column: string;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  tasks: unknown[];

  constructor(public taskService: TaskService, public crud: CRUDService) {
    super();
  }

  ngOnInit(): void {
    this.getTasks(this.column);
  }

  public showDialog(task) {
    this.taskService.showDialog(task);
  }

  public getTasks(status) {
    this.crud
      .getElementsByProperty('Tasks', 'status', status)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((tasks) => {
        this.tasks = tasks;
      });
  }
}

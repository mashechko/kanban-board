import { Component, Input, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { pipe } from 'rxjs';
import { TaskService } from '../../../services/task.service';
import { Task } from '../../../task-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { User } from '../../../user-interface';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;

  public developer: string;

  constructor(private taskService: TaskService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getUser();
  }

  public showDialog(task) {
    this.taskService.updateTask(task);
  }

  public getUser(): void {
    this.crud
      .getElementsByProperty('users', 'displayName', this.task.assignedTo)
      .pipe(
        map((value: User[]) => {
          this.developer = value[0].photoURL;
        }),
        take(1),
      )
      .subscribe();
  }
}

import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from './tasks-block/task/task-interface';
import { CRUDService } from '../../services/crudservice.service';
import { StoreService } from '../../services/store.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  public columns: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  public user: string;

  private droppedTask: Task;

  constructor(
    private taskService: TaskService,
    private auth: AuthService,
    private storeService: StoreService,
    private crud: CRUDService,
  ) {}

  ngOnInit(): void {
    this.user = this.storeService.user.displayName;
  }

  public showDialog(status) {
    this.taskService.createTask(status);
  }

  public handleTask(data) {
    const event = data[0];
    const task = data[1];
    this.droppedTask = task;
    if (event.previousContainer !== event.container) {
      this.droppedTask.status = event.container.data;
      this.droppedTask.comments.push(`${this.user} changed status to "${event.container.data}"`);
      this.crud.updateObject('Tasks', this.droppedTask.id, this.droppedTask);
    }
  }
}

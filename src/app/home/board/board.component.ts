import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TaskService } from '../../services/task.service';
import { AuthService } from '../../services/auth.service';
import { Task } from '../../task-interface';
import { CRUDService } from '../../services/crudservice.service';

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
    private crud: CRUDService,
  ) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser() {
    return this.auth.user$.pipe(map((value) => value.displayName)).subscribe((user) => {
      this.user = user;
    });
  }

  public showDialog(status, user) {
    this.taskService.createTask(status, user);
  }

  public handleTask(task) {
    this.droppedTask = task;
  }

  public drop(event: CdkDragDrop<any>) {
    if (event.previousContainer !== event.container) {
      this.droppedTask.status = event.container.data;
      this.crud.updateObject('Tasks', this.droppedTask.id, this.droppedTask);
    }
  }
}

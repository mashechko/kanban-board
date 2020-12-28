import { Component, OnInit } from '@angular/core';
import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { DialogService } from '../../services/dialog.service';
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

  private commentId: string;

  constructor(
    private dialogService: DialogService,
    private auth: AuthService,
    private storeService: StoreService,
    private crud: CRUDService,
  ) {}

  ngOnInit(): void {
    this.user = this.storeService.user.displayName;
  }

  public showDialog(status) {
    this.dialogService.createTask(status);
  }

  public handleTask(data) {
    const [event, task] = data;
    this.droppedTask = task;
    if (event.previousContainer !== event.container) {
      this.droppedTask.status = event.container.data;
      const comment = {
        content: `${this.user} changed status to ${event.container.data}`,
        type: 'status',
        taskId: this.droppedTask.id,
      };
      this.crud.createEntity('comments', comment).subscribe((value) => {
        this.commentId = value;
        this.droppedTask.comments.push(this.commentId);
      });
      this.crud.updateObject('Tasks', this.droppedTask.id, this.droppedTask);
    }
  }
}

import { Component, OnChanges, OnInit } from '@angular/core';
import { CdkDragDrop, transferArrayItem } from '@angular/cdk/drag-drop';
import { take } from 'rxjs/operators';
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
export class BoardComponent implements OnInit, OnChanges {
  private tasks: Task[];

  public sortedTasks = null;

  public statuses: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit() {
    this.getTasks();
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

  private getTasks() {
    if (this.tasks) return;
    this.crud.getCollectionWithOrder('Tasks', 'lastModified', false).subscribe((value: Task[]) => {
      this.tasks = value;
      this.sortTasks();
    });
  }

  public showDialog(status) {
    this.dialogService.createTask(status);
  }
}

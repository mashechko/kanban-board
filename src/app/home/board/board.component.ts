import { Component, OnChanges, OnInit } from '@angular/core';
import { DialogService } from '../../services/dialog.service';
import { Task } from './tasks-block/task/task-interface';
import { CRUDService } from '../../services/crudservice.service';
import { StoreService } from '../../services/store.service';
import { User } from '../../user-interface';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit, OnChanges {
  public tasks: Task[];

  private user: User;

  public sortedTasks = null;

  public statuses: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  constructor(
    private dialogService: DialogService,
    private crud: CRUDService,
    private storeService: StoreService,
  ) {}

  ngOnInit() {
    this.user = this.storeService.user;
    this.getUserData();
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
    this.crud.getElementById('users', this.user.uid).subscribe((value: User) => {
      this.user = value;
      if (this.user.projects && this.user.projects.length) {
        this.getTasks();
      }
    });
  }

  private getTasks() {
    this.crud
      .getSortedElementsOfArray('Tasks', 'projectId', this.user.projects, 'lastModified', false)
      .subscribe((value: Task[]) => {
        this.tasks = value;
        this.sortTasks();
      });
  }

  public showDialog(status) {
    this.dialogService.createTask(status);
  }
}

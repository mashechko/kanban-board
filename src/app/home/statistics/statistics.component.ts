import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CRUDService } from '../../services/crudservice.service';
import { AutoUnsubscribe } from '../../auto-unsubscribe';
import { Project } from '../projects/project/project-interface';
import { Task } from '../board/tasks-block/task/task-interface';
import { User } from '../../user-interface';
import { StoreService } from '../../services/store.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css', '../styles/editor-style.css'],
})
export class StatisticsComponent implements OnInit, OnDestroy {
  public projects: Project[];

  public tasks = null;

  public data = null;

  public user: User;

  public view: any[] = window.innerWidth > 1200 ? [1000, 600] : [window.innerWidth - 50, 600];

  public pie = false;

  // options
  showXAxis = true;

  showYAxis = true;

  gradient = true;

  showLegend = true;

  showXAxisLabel = true;

  xAxisLabel = 'Tasks';

  showYAxisLabel = true;

  yAxisLabel = 'Amount';

  legendTitle = 'Statuses';

  showLabels = true;

  colorScheme = {
    domain: ['#439450', '#A06BF7', '#4441F3', '#FB7B33'],
  };

  public selected = 'all';

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private crud: CRUDService, private storeService: StoreService) {}

  ngOnInit(): void {
    this.user = this.storeService.user;
    this.getUserData();
    this.getProjects();
    this.getTasks();
  }

  private getProjects() {
    this.crud
      .getCollection('projects')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Project[]) => {
        this.projects = value;
      });
  }

  private getTasks() {
    this.crud
      .getCollection('Tasks')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value) => {
        if (value.length) {
          this.sortTasks(value);
        } else {
          this.data = null;
        }
      });
  }

  private getTasksOfProject(projectID) {
    this.crud
      .getElementsByProperty('Tasks', 'projectId', projectID, 'lastModified')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task[]) => {
        if (value.length) {
          this.sortTasks(value);
        } else {
          this.data = null;
        }
      });
  }

  private getUserTasks() {
    this.crud
      .getElementsOfArray('Tasks', 'projectId', this.user.projects)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task[]) => {
        if (value.length) {
          this.sortTasks(value);
        } else {
          this.data = null;
        }
      });
  }

  private sortTasks(tasks) {
    this.tasks = {
      'ready to dev': [],
      'in development': [],
      'in qa': [],
      closed: [],
    };
    tasks.forEach((task: Task) => {
      switch (task.status) {
        case 'ready to dev':
          this.tasks['ready to dev'].push(task);
          break;
        case 'in development':
          this.tasks['in development'].push(task);
          break;
        case 'in qa':
          this.tasks['in qa'].push(task);
          break;
        case 'closed':
          this.tasks.closed.push(task);
          break;
        default:
          this.tasks['ready to dev'].push(task);
      }
      this.data = [
        { name: 'Ready to Dev', value: this.tasks['ready to dev'].length },
        { name: 'In Development', value: this.tasks['in development'].length },
        { name: 'In QA', value: this.tasks['in qa'].length },
        { name: 'Closed', value: this.tasks.closed.length },
      ];
    });
  }

  public changeView(event) {
    if (event.value === 'all') {
      this.getTasks();
    } else if (event.value === 'user') {
      this.getUserTasks();
    } else {
      this.getTasksOfProject(event.value);
    }
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

  public showPie(event) {
    if (event.checked) {
      this.pie = true;
    } else {
      this.pie = false;
    }
  }

  ngOnDestroy(): void {}
}

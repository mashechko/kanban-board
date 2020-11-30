import {Component, Input, OnInit} from '@angular/core';
import {TaskService} from '../task.service';
import {CRUDService} from '../crudservice.service';
import {Task} from '../task-interface';

@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css']
})
export class TasksBlockComponent implements OnInit {
  @Input() column: string;
  tasks: unknown[];
  constructor(public taskService: TaskService,
              public crud: CRUDService) { }

  ngOnInit(): void {
    this.getTasks(this.column);
  }
  public showDialog(task) {
    this.taskService.showDialog(task);
  }
  public getTasks(status) {
    this.crud.getElementsByProperty('Tasks', 'status', status)
      .subscribe(tasks => this.tasks = tasks);
  }
}

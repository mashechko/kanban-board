import { Component, Input, OnInit } from '@angular/core';
import { TaskService } from '../services/task.service';
import { Task } from '../task-interface';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.css'],
})
export class TaskComponent implements OnInit {
  @Input() task: Task;

  constructor(public taskService: TaskService) {}

  ngOnInit(): void {}

  public showDialog(task) {
    this.taskService.showDialog(task);
  }
}

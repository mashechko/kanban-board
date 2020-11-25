import { Component, OnInit, Input } from '@angular/core';
import {Task} from '../task-interface';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {

  constructor() { }

  @Input() task: Task;

  ngOnInit(): void {
  }

}

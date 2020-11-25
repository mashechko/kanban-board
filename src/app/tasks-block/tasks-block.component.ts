import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css']
})
export class TasksBlockComponent implements OnInit {

  public columns: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];
  constructor() { }

  ngOnInit(): void {
  }

}

import { Component, OnInit} from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-task-editor',
  templateUrl: './task-editor.component.html',
  styleUrls: ['./task-editor.component.css']
})
export class TaskEditorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TaskEditorComponent>) { }

  ngOnInit(): void {
  }

}

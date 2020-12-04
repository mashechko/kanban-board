import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { TaskService } from '../task.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
})
export class SidebarComponent implements OnInit {
  public eventKey: Subject<any> = new Subject<any>();

  constructor(public tskService: TaskService) {}

  ngOnInit(): void {
    this.eventKey
      .pipe(
        debounceTime(500),
        map((value) => value.target.value),
        filter((value: string) => value.length > 2),
      )
      .subscribe((value) => console.log(value));
  }

  public showDialog() {
    this.tskService.showDialog(null);
  }
}

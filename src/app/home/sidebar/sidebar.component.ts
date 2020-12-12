import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  animations: [
    trigger('openClose', [
      state(
        'open',
        style({
          height: '230px',
        }),
      ),
      state(
        'closed',
        style({
          height: '50px',
        }),
      ),
      transition('open => closed', [animate('0.3s')]),
      transition('closed => open', [animate('0.3s')]),
    ]),
  ],
})
export class SidebarComponent implements OnInit {
  public eventKey: Subject<any> = new Subject<any>();

  public isOpen = false;

  ngOnInit(): void {
    this.eventKey
      .pipe(
        debounceTime(500),
        map((value) => value.target.value),
        filter((value: string) => value.length > 2),
      )
      .subscribe();
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

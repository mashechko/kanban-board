import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, map, takeUntil } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CRUDService } from '../../services/crudservice.service';
import { AutoUnsubscribe } from '../../auto-unsubscribe';

@AutoUnsubscribe()
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
export class SidebarComponent implements OnInit, OnDestroy {
  public eventKey: Subject<any> = new Subject<any>();

  public projectsNumber: number;

  public isOpen = false;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getProjects();
    // this.eventKey
    //   .pipe(
    //     debounceTime(500),
    //     map((value) => value.target.value),
    //     filter((value: string) => value.length > 2),
    //   )
    //   .subscribe();
  }

  private getProjects() {
    this.crud
      .getCollection('projects')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value) => {
        this.projectsNumber = value.length;
      });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }

  ngOnDestroy(): void {}
}

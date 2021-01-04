import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { debounceTime, filter, map } from 'rxjs/operators';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { CRUDService } from '../../services/crudservice.service';

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

  public projectsNumber: number;

  public isOpen = false;

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
    this.crud.getCollection('projects').subscribe((value) => {
      this.projectsNumber = value.length;
    });
  }

  toggle() {
    this.isOpen = !this.isOpen;
  }
}

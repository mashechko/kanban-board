import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CRUDService } from '../../../services/crudservice.service';
import { User } from '../../../user-interface';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-project-dev',
  templateUrl: './project-dev.component.html',
  styleUrls: ['./project-dev.component.css'],
})
export class ProjectDevComponent implements OnInit, OnDestroy {
  @Input() userUid: string;

  public user: User;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getUser();
  }

  private getUser() {
    this.crud
      .getElementById('users', this.userUid)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        this.user = value;
      });
  }

  ngOnDestroy(): void {}
}

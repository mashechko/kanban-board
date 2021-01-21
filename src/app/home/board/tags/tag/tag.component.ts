import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CRUDService } from '../../../../services/crudservice.service';
import { TagInterface } from './tag-interface';
import { AutoUnsubscribe } from '../../../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent implements OnInit, OnDestroy {
  @Input() tag: TagInterface;

  @Input() tagId: string;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    if (this.tagId) {
      this.getTag();
    }
  }

  private getTag() {
    this.crud
      .getElementById('tags', this.tagId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: TagInterface) => {
        this.tag = value;
      });
  }

  ngOnDestroy(): void {}
}

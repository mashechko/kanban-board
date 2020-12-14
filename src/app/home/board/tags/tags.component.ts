import { Component, ElementRef, Input, OnInit } from '@angular/core';
import { map, take } from 'rxjs/operators';
import { CRUDService } from '../../../services/crudservice.service';
import { TagInterface } from './tag-interface';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
})
export class TagsComponent implements OnInit {
  @Input() tagId: string;

  public tag: TagInterface;

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getTag();
  }

  public getTag(): void {
    this.crud
      .getElementsByProperty('tags', 'id', this.tagId)
      .pipe(
        map((value: TagInterface[]) => {
          // eslint-disable-next-line prefer-destructuring
          this.tag = value[0];
        }),
        take(1),
      )
      .subscribe();
  }
}

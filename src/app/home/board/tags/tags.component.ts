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

  public tag;

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getTag();
  }

  public getTag(): void {
    this.crud.getElementById('tags', this.tagId).subscribe((value) => {
      this.tag = value;
    });
  }
}

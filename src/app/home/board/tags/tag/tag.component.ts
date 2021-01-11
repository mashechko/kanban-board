import { Component, Input, OnInit } from '@angular/core';
import { CRUDService } from '../../../../services/crudservice.service';
import { TagInterface } from './tag-interface';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent implements OnInit {
  @Input() tag: TagInterface;

  @Input() tagId: string;

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    if (this.tagId) {
      this.getTag();
    }
  }

  private getTag() {
    this.crud.getElementById('tags', this.tagId).subscribe((value: TagInterface) => {
      this.tag = value;
    });
  }
}

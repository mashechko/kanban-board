import { Component, Input } from '@angular/core';
import { CRUDService } from '../../../../services/crudservice.service';
import { TagInterface } from './tag-interface';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.css'],
})
export class TagComponent {
  @Input() tag: TagInterface;
}

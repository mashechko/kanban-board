import {
  Component,
  ElementRef,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CRUDService } from '../../../services/crudservice.service';
import { TagInterface } from './tag/tag-interface';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css', '../../styles/editor-style.css'],
})
export class TagsComponent implements OnInit, OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onClick = new EventEmitter();

  @ViewChild('inputElementTag')
  public tagElement: ElementRef;

  @ViewChild('inputElementColor')
  public colorElement: ElementRef;

  public selectedColor = '#ee4d4d';

  public tagPreviewText: string;

  public openTagWindow = false;

  public openNewTagWindow = false;

  public tags: TagInterface[];

  public tagColors = ['#ee4d4d', '#ff8b3a', '#679f50', '#2f60fd', '#662ffd', '#da71de', '#ff0303'];

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getTags();
  }

  private getTags() {
    this.crud
      .getCollection('tags')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: TagInterface[]) => {
        this.tags = value;
      });
  }

  public changeColor(color) {
    this.selectedColor = color;
  }

  public onKey(event) {
    this.tagPreviewText = event.target.value;
  }

  public addNewTag() {
    const tag = { name: this.tagPreviewText, background: this.selectedColor };
    if (this.tagPreviewText.length) {
      this.crud.createEntity('tags', tag).subscribe();
    }
  }

  public toggle(window) {
    if (window === 'TagWindow') {
      this.openTagWindow = !this.openTagWindow;
    } else if (window === 'NewTagWindow') {
      this.openNewTagWindow = !this.openNewTagWindow;
    }
  }

  public deleteTag(id) {
    this.crud.deleteObject('tags', id).subscribe();
  }

  ngOnDestroy(): void {}
}

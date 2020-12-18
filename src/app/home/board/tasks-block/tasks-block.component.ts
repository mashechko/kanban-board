import {
  Component,
  EventEmitter,
  HostListener,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CRUDService } from '../../../services/crudservice.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css'],
})
export class TasksBlockComponent implements OnInit, OnDestroy {
  @Input() column: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDrop = new EventEmitter();

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  public tasks: unknown[];

  public isDraggable = true;

  private innerWidth: number;

  constructor(private crud: CRUDService) {}

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.innerWidth = window.innerWidth;
    this.isDraggable = this.innerWidth >= 1290;
  }

  ngOnInit(): void {
    this.getTasks(this.column);
  }

  public getTasks(status) {
    this.crud.getElementsByProperty('Tasks', 'status', status).subscribe((tasks) => {
      this.tasks = tasks;
    });
  }

  ngOnDestroy(): void {}
}

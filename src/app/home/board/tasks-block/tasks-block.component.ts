import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ActivatedRoute } from '@angular/router';
import { CRUDService } from '../../../services/crudservice.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';
import { Task } from './task/task-interface';
import { StoreService } from '../../../services/store.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-tasks-block',
  templateUrl: './tasks-block.component.html',
  styleUrls: ['./tasks-block.component.css', '../../styles/editor-style.css'],
})
export class TasksBlockComponent implements OnInit, OnDestroy {
  @Input() tasks: Task[];

  @Input() column: string;

  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  @Output() onDrop = new EventEmitter();

  public isDraggable: boolean;

  public user: string;

  private commentId: string;

  constructor(
    private crud: CRUDService,
    private storeService: StoreService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.isDraggable = window.innerWidth >= 1290;
    this.user = this.storeService.user.displayName;
  }

  public addBlock(task: Task) {
    task.isDragging = true;
    this.crud.updateObject('Tasks', task.id, task);
  }

  public handleTask(event, task) {
    if (event.previousContainer !== event.container) {
      transferArrayItem(
        event.previousContainer.data.tasks,
        event.container.data.tasks,
        event.previousIndex,
        event.currentIndex,
      );
      task.status = event.container.data.status;
      task.isDragging = false;
      const comment = {
        content: `${this.user} changed status to ${event.container.data.status}`,
        type: 'status',
        taskId: task.id,
        date: new Date().getTime(),
      };
      this.crud.createEntity('comments', comment).subscribe((value) => {
        this.commentId = value;
        task.comments.push(this.commentId);
        task.lastModified = new Date().getTime();
        this.crud.updateObject('Tasks', task.id, task);
      });
    } else {
      task.isDragging = false;
      this.crud.updateObject('Tasks', task.id, task);
    }
  }

  public trackByFn(index, item) {
    return item.lastModified;
  }

  ngOnDestroy(): void {}
}

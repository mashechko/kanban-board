import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';
import { Project } from './project-interface';
import { User } from '../../../user-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';

@AutoUnsubscribe()
@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.css'],
})
export class ProjectComponent implements OnInit, OnDestroy {
  @Input() project: Project;

  public createdBy: User;

  public developers: User[];

  public devPreview: User[];

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(private dialogService: DialogService, private crud: CRUDService) {}

  ngOnInit(): void {
    this.getCreator();
    this.getSelectedDevs();
  }

  public showDialog(project) {
    this.dialogService.updateProject(project);
  }

  private getCreator() {
    this.crud
      .getElementById('users', this.project.createdBy)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        this.createdBy = value;
      });
  }

  private getSelectedDevs() {
    this.crud
      .getElementsOfArray('users', 'uid', this.project.selectedDevs.slice(0, 3))
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User[]) => {
        this.devPreview = value;
      });
  }

  ngOnDestroy(): void {}
}

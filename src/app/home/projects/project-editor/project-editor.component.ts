import { Component, DoCheck, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { NotificationsService } from 'angular2-notifications';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Project } from '../project/project-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { StoreService } from '../../../services/store.service';
import { User } from '../../../user-interface';
import { noWhitespaceValidator } from '../../trim-validator';
import { Task } from '../../board/tasks-block/task/task-interface';
import { STATUSES } from '../../STATUSES';
import { AutoUnsubscribe } from '../../../auto-unsubscribe';
import { UploadService } from '../../../services/upload.service';

@AutoUnsubscribe()
@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css', '../../styles/editor-style.css'],
})
export class ProjectEditorComponent implements OnInit, DoCheck, OnDestroy {
  public project: Project = null;

  formGr: FormGroup;

  public developers: User[];

  public statuses: string[] = STATUSES;

  public searchDevs: User[];

  public currentUser: User;

  private tasks: Task[];

  public sortedTasks: object;

  public projectLink: string;

  private unsubscribeStream$: Subject<void> = new Subject<void>();

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProjectEditorComponent>,
    private crud: CRUDService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private notification: NotificationsService,
    private uploadService: UploadService,
  ) {
    this.project = { ...data.projectInfo };
  }

  ngOnInit(): void {
    this.currentUser = this.storeService.user;
    this.initForm();
    this.getDevelopers();
    if (this.project.id) {
      this.getTasks();
    }
  }

  ngDoCheck() {
    this.projectLink = window.location.href;
  }

  private getDevelopers() {
    return this.crud.getCollection('users').subscribe((developers: User[]) => {
      this.developers = developers;
      this.searchDevs = developers;
    });
  }

  private getTasks() {
    this.crud
      .getElementsByProperty('Tasks', 'projectId', this.project.id, 'lastModified')
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: Task[]) => {
        this.tasks = value;
        this.sortTasks();
      });
  }

  private sortTasks() {
    this.sortedTasks = {
      'ready to dev': [],
      'in development': [],
      'in qa': [],
      closed: [],
    };
    this.tasks.forEach((task) => {
      switch (task.status) {
        case 'ready to dev':
          this.sortedTasks['ready to dev'].push(task);
          break;
        case 'in development':
          this.sortedTasks['in development'].push(task);
          break;
        case 'in qa':
          this.sortedTasks['in qa'].push(task);
          break;
        case 'closed':
          this.sortedTasks.closed.push(task);
          break;
        default:
          this.sortedTasks['ready to dev'].push(task);
      }
    });
  }

  public updateDevs(event) {
    if (this.project.selectedDevs.length > event.value.length) {
      this.project.selectedDevs.forEach((devId) => {
        if (event.value.indexOf(devId) === -1) {
          this.deleteProjectFromDev(devId, this.project.id);
        }
      });
    }
    this.project.selectedDevs = event.value;
  }

  public dropNotification(content, type) {
    if (this.currentUser.uid !== this.project.createdBy) {
      const title = 'Warning';

      const temp = {
        type,
        title: 'Warning',
        content,
        timeOut: 5000,
        showProgressBar: true,
        pauseOnHover: true,
        clickToClose: true,
        animate: 'fromRight',
      };

      // @ts-ignore
      this.notification.create(title, content, type, temp);
    }
  }

  private setProjectToDev(devId: string, projectId: string) {
    let developer: User;
    this.crud
      .getElementById('users', devId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        developer = value;
        if (developer.projects) {
          if (developer.projects.indexOf(projectId) === -1) {
            developer.projects.push(projectId);
          }
        } else {
          developer.projects = [projectId];
        }
        this.crud
          .updateObject('users', devId, developer)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      });
  }

  private deleteProjectFromDev(devId: string, projectId: string) {
    let developer: User;
    this.crud
      .getElementById('users', devId)
      .pipe(takeUntil(this.unsubscribeStream$))
      .subscribe((value: User) => {
        developer = value;
        developer.projects.splice(developer.projects.indexOf(projectId), 1);
        this.crud
          .updateObject('users', devId, developer)
          .pipe(takeUntil(this.unsubscribeStream$))
          .subscribe();
      });
  }

  public save(project) {
    let projectID: string;
    this.project.lastModified = new Date().getTime();
    if (project.id) {
      this.crud
        .updateObject('projects', project.id, project)
        .pipe(takeUntil(this.unsubscribeStream$))
        .subscribe();
      projectID = this.project.id;
      this.dialogRef.close();
      if (this.project.createdBy === this.currentUser.uid) {
        this.project.selectedDevs.forEach((devID) => {
          this.setProjectToDev(devID, projectID);
        });
      }
    } else {
      this.crud.createEntity('projects', project).subscribe((value) => {
        projectID = value;
        this.project.selectedDevs.forEach((devID) => {
          this.setProjectToDev(devID, projectID);
        });
      });
      this.dialogRef.close();
    }
  }

  public delete(project) {
    if (this.currentUser.uid === this.project.createdBy) {
      project.selectedDevs.forEach((devID) => {
        this.deleteProjectFromDev(devID, project.id);
      });
      this.crud.deleteObject('projects', project.id).subscribe();
      if (this.tasks.length) {
        this.dropNotification('All tasks of this project will be deleted', 'warn');
        this.tasks.forEach((task) => {
          task.comments.forEach((comment) => {
            this.crud.deleteObject('comments', comment).subscribe();
          });
          if (task.imageLinks) {
            task.imageLinks.forEach((image) => {
              this.uploadService.deleteFile(image);
            });
          }
          this.crud.deleteObject('Tasks', task.id).subscribe();
        });
      }
      this.dialogRef.close();
    } else {
      this.dropNotification('Only project creator can delete project', 'warn');
    }
  }

  onSubmit() {
    const { controls } = this.formGr;

    if (this.formGr.invalid) {
      Object.keys(controls).forEach((controlName) => controls[controlName].markAsTouched());

      return;
    }

    this.project.name = this.formGr.controls.name.value;
    this.project.info = this.formGr.controls.info.value;
    this.project.selectedDevs = this.formGr.controls.selectedDevs.value;

    this.save(this.project);
  }

  isControlInvalid(controlName: string): boolean {
    const control = this.formGr.controls[controlName];

    const result = control.invalid && control.touched;

    return result;
  }

  private initForm() {
    this.formGr = this.fb.group({
      name: [this.project.name, [Validators.required, noWhitespaceValidator]],
      info: [this.project.info, Validators.maxLength(1000)],
      selectedDevs: [this.project.selectedDevs],
    });
    if (this.project.id) {
      if (this.project.createdBy !== this.currentUser.uid) {
        this.formGr.controls.selectedDevs.disable();
      }
      if (
        this.project.selectedDevs.indexOf(this.currentUser.uid) === -1 &&
        this.project.createdBy !== this.currentUser.uid
      ) {
        this.formGr.controls.name.disable();
        this.formGr.controls.info.disable();
        this.formGr.controls.selectedDevs.disable();
      }
    }
  }

  public onKey(event) {
    this.searchDevs = this.search(event.target.value);
  }

  private search(value: string) {
    const filter = value.toLowerCase();
    return this.developers.filter((option: firebase.User) =>
      option.displayName.toLowerCase().includes(filter),
    );
  }

  ngOnDestroy(): void {}
}

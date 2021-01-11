import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { NotificationsService } from 'angular2-notifications';
import { Project } from '../project/project-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { StoreService } from '../../../services/store.service';
import { User } from '../../../user-interface';
import { noWhitespaceValidator } from '../../trim-validator';

@Component({
  selector: 'app-project-editor',
  templateUrl: './project-editor.component.html',
  styleUrls: ['./project-editor.component.css', '../../styles/editor-style.css'],
})
export class ProjectEditorComponent implements OnInit, OnDestroy {
  public project: Project = null;

  formGr: FormGroup;

  public developers: User[];

  public searchDevs: User[];

  public currentUser: User;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProjectEditorComponent>,
    private crud: CRUDService,
    private fb: FormBuilder,
    private storeService: StoreService,
    private notification: NotificationsService,
  ) {
    this.project = { ...data.projectInfo };
  }

  ngOnInit(): void {
    this.initForm();
    this.getDevelopers();
    this.currentUser = this.storeService.user;
  }

  private getDevelopers() {
    return this.crud.getCollection('users').subscribe((developers: firebase.User[]) => {
      this.developers = developers;
      this.searchDevs = developers;
    });
  }

  public updateDevs(event) {
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
    this.crud.getElementById('users', devId).subscribe((value: User) => {
      developer = value;
      if (developer.projects && developer.projects.indexOf(projectId) === -1) {
        developer.projects.push(projectId);
      } else {
        developer.projects = [projectId];
      }
      this.crud.updateObject('users', devId, developer);
    });
  }

  private deleteProjectFromDev(devId: string, projectId: string) {
    let developer: User;
    this.crud.getElementById('users', devId).subscribe((value: User) => {
      developer = value;
      developer.projects.splice(developer.projects.indexOf(projectId), 1);
      this.crud.updateObject('users', devId, developer);
    });
  }

  public save(project) {
    let projectID: string;
    this.project.lastModified = new Date().getTime();
    if (project.id) {
      this.crud.updateObject('projects', project.id, project);
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
      this.crud.deleteObject('projects', project.id);
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

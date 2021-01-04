import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import firebase from 'firebase';
import { Project } from '../project/project-interface';
import { CRUDService } from '../../../services/crudservice.service';
import { StoreService } from '../../../services/store.service';
import { UploadService } from '../../../services/upload.service';
import { HomeComponent } from '../../home.component';
import { User } from '../../../user-interface';

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

  public dropNotification() {
    if (this.currentUser.uid !== this.project.createdBy) {
      console.log('only creator can add developers');
    }
  }

  public save(project) {
    this.project.lastModified = new Date().getTime();
    if (project.id) {
      this.crud.updateObject('projects', project.id, project);
      this.dialogRef.close();
    } else {
      this.crud.createEntity('projects', project);
      this.dialogRef.close();
    }
  }

  public delete(task) {
    this.crud.deleteObject('projects', task.id);
    this.dialogRef.close();
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
      name: [this.project.name, [Validators.required]],
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

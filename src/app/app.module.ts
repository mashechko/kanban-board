import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TasksBlockComponent } from './tasks-block/tasks-block.component';
import { TaskComponent } from './task/task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { DevelopperComponent } from './developper/developper.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { RegistrationComponent } from './registration/registration.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';


import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import {MatButtonModule} from '@angular/material/button';
import {MatDialogModule} from '@angular/material/dialog';


@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TasksBlockComponent,
    TaskComponent,
    SidebarComponent,
    DevelopperComponent,
    TaskEditorComponent,
    RegistrationComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    AngularFireStorageModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule,
    AngularFireAuthModule,
    MatButtonModule,
    MatDialogModule
  ],
  entryComponents: [
    TaskEditorComponent
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

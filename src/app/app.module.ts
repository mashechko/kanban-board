import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { A11yModule } from '@angular/cdk/a11y';

import { AppComponent } from './app.component';
import { BoardComponent } from './board/board.component';
import { TasksBlockComponent } from './tasks-block/tasks-block.component';
import { TaskComponent } from './task/task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TaskEditorComponent } from './task-editor/task-editor.component';
import { HomeComponent } from './home/home.component';
import { WelcomeComponent } from './welcome/welcome.component';

import { environment } from '../environments/environment';

import { AppRoutingModule } from './app-routing.module';
import { CommentsComponent } from './task-editor/comments/comments.component';

@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    TasksBlockComponent,
    TaskComponent,
    SidebarComponent,
    TaskEditorComponent,
    HomeComponent,
    WelcomeComponent,
    CommentsComponent,
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
    MatDialogModule,
    A11yModule,
    AppRoutingModule,
    MatSelectModule,
  ],
  entryComponents: [TaskEditorComponent],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}

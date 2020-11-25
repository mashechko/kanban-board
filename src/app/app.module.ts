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
    RegistrationComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

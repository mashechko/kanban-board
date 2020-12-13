import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxTrimModule } from 'ngx-trim';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BoardComponent } from './board/board.component';
import { TasksBlockComponent } from './board/tasks-block/tasks-block.component';
import { TaskComponent } from './board/tasks-block/task/task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TaskEditorComponent } from './board/task-editor/task-editor.component';
import { ZoomDirective } from '../zoom.directive';
import { TruncatePipe } from '../truncate.pipe';
import { CheckDueDateDirective } from '../check-due-date.directive';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    TaskEditorComponent,
    BoardComponent,
    TasksBlockComponent,
    TaskComponent,

    ZoomDirective,
    TruncatePipe,
    CheckDueDateDirective,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MatButtonModule,
    FormsModule,
    A11yModule,
    NgxTrimModule,
    DragDropModule,
    MatDialogModule,
    ReactiveFormsModule,
  ],
  exports: [CheckDueDateDirective],
})
export class HomeModule {}

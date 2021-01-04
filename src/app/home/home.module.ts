import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { NgxTrimModule } from 'ngx-trim';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BoardComponent } from './board/board.component';
import { TasksBlockComponent } from './board/tasks-block/tasks-block.component';
import { TaskComponent } from './board/tasks-block/task/task.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TaskEditorComponent } from './board/task-editor/task-editor.component';
import { ZoomDirective } from '../directives/zoom.directive';
import { TruncatePipe } from '../truncate.pipe';
import { CheckDueDateDirective } from '../directives/check-due-date.directive';
import { TagComponent } from './board/tags/tag/tag.component';
import { SetBackgroundDirective } from '../directives/set-background.directive';
import { DialogService } from '../services/dialog.service';
import { ProjectComponent } from './projects/project/project.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectEditorComponent } from './projects/project-editor/project-editor.component';
import { CommentComponent } from './board/task-editor/comment/comment.component';
import { TagsComponent } from './board/tags/tags.component';
import { ProjectDevComponent } from './projects/project-dev/project-dev.component';

@NgModule({
  declarations: [
    HomeComponent,
    SidebarComponent,
    TaskEditorComponent,
    BoardComponent,
    TasksBlockComponent,
    TaskComponent,
    TagComponent,
    ZoomDirective,
    TruncatePipe,
    CheckDueDateDirective,
    SetBackgroundDirective,
    ProjectComponent,
    ProjectsComponent,
    ProjectEditorComponent,
    CommentComponent,
    TagsComponent,
    ProjectDevComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,

    A11yModule,
    NgxTrimModule,
    DragDropModule,

    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule,
  ],
  exports: [CheckDueDateDirective, SetBackgroundDirective, HomeComponent],
  providers: [DialogService],
})
export class HomeModule {}

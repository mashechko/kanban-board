import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';
import { A11yModule } from '@angular/cdk/a11y';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDividerModule } from '@angular/material/divider';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { NgxChartsModule } from '@swimlane/ngx-charts';
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
import { UploadService } from '../services/upload.service';
import { NotFoundComponent } from './not-found/not-found.component';
import { StatisticsComponent } from './statistics/statistics.component';

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
    NotFoundComponent,
    StatisticsComponent,
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    ClipboardModule,
    A11yModule,
    DragDropModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatDividerModule,
    MatNativeDateModule,
    MatProgressBarModule,
    MatIconModule,
    NgxChartsModule,
    SimpleNotificationsModule.forRoot(),
  ],
  exports: [CheckDueDateDirective, SetBackgroundDirective, HomeComponent],
  providers: [DialogService, UploadService],
})
export class HomeModule {}

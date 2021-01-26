import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { GuardService } from '../services/guard.service';
import { BoardComponent } from './board/board.component';
import { ProjectsComponent } from './projects/projects.component';
import { StatisticsComponent } from './statistics/statistics.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [GuardService],
    children: [
      { path: '', redirectTo: 'board', pathMatch: 'full' },
      { path: 'projects', component: ProjectsComponent },
      {
        path: 'board',
        component: BoardComponent,
        children: [{ path: 'task/:id', component: BoardComponent }],
      },
      { path: 'statistics', component: StatisticsComponent },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

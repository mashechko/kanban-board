import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { GuardService } from '../services/guard.service';
import { BoardComponent } from './board/board.component';
import { ProjectsComponent } from './projects/projects.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
    canActivate: [GuardService],
    children: [
      {
        path: 'board',
        component: BoardComponent,
      },
      {
        path: 'projects',
        component: ProjectsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

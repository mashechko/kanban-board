import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { GuardService } from '../services/guard.service';
import { ProjectComponent } from './projects/project/project.component';
import { BoardComponent } from './board/board.component';

const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [GuardService] },
  // { path: 'board', component: BoardComponent },
  // { path: 'projects', component: ProjectComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { GuardService } from '../services/guard.service';

const routes: Routes = [{ path: '', component: HomeComponent, canActivate: [GuardService] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule {}

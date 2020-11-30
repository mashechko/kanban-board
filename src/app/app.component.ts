import { Component } from '@angular/core';
import {CRUDService} from './crudservice.service';
import {AuthService} from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'kanban-board';
  email: string;
  password: string;

  constructor(
    public auth: AuthService
  ) {}

}




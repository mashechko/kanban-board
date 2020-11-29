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
    private crudService: CRUDService,
    public auth: AuthService
  ) {}
  public createObject(): void {
    this.crudService.createEntity('test', {name: 'Test 2'}).subscribe(value => console.log(value));
  }
  public getObject() {
    this.crudService.getData('test').subscribe(value => console.log(value));
  }
}




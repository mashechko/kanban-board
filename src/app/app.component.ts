import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'kanban-board';

  constructor(private router: Router) {}

  public navigateTo(path) {
    this.router.navigate(path);
  }
}

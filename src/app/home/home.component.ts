import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  email: string;

  password: string;

  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public logout() {
    of(this.auth.signOut()).subscribe(() => {
      this.router.navigate(['welcome']);
    });
  }
}

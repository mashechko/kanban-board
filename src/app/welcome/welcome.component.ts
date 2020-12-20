import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css'],
})
export class WelcomeComponent implements OnInit {
  constructor(public auth: AuthService, private router: Router) {}

  ngOnInit(): void {}

  public login() {
    this.auth.googleSign().subscribe(() => {
      this.router.navigate(['home']);
    });
  }
}

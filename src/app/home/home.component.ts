import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { User } from '../user-interface';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public user: User;

  constructor(private auth: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.getUserData();
  }

  public logout() {
    of(this.auth.signOut()).subscribe(() => {
      this.router.navigate(['welcome']);
    });
  }

  private getUserData() {
    return this.auth.user$
      .pipe(
        map((value) => {
          this.user = value;
        }),
      )
      .subscribe();
  }
}

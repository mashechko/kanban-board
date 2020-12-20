import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { map } from 'rxjs/operators';
import firebase from 'firebase';
import { AuthService } from '../services/auth.service';
import { User } from '../user-interface';
import { StoreService } from '../services/store.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  public user: firebase.User;

  constructor(
    private auth: AuthService,
    private router: Router,
    private storeService: StoreService,
  ) {}

  ngOnInit(): void {
    this.storeService.user$.subscribe((value) => {
      this.user = value;
    });
  }

  public logout() {
    of(this.auth.signOut()).subscribe(() => {
      this.router.navigate(['welcome']);
    });
  }
}

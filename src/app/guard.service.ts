import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { map, tap } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authService.user$.pipe(
      map((value) => !!value),
      tap((isLogged) => {
        if (!isLogged) {
          this.router.navigate(['/welcome']);
        }
      }),
    );
  }
}

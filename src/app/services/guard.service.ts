import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router } from '@angular/router';

import { map, take, tap } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class GuardService implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot) {
    return this.authService.user$.pipe(
      take(1),
      map((value) => !!value),
      tap((isLogged) => {
        if (!isLogged) {
          this.router.navigate(['/welcome']);
        }
      }),
    );
  }
}

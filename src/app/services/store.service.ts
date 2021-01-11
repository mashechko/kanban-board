import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import firebase from 'firebase';
import User = firebase.User;

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public user$: ReplaySubject<User> = new ReplaySubject<User>(1);

  private _user: User;

  public get user(): User {
    // eslint-disable-next-line no-underscore-dangle
    return this._user;
  }

  public set user(user: User) {
    // eslint-disable-next-line no-underscore-dangle
    if (!this._user || this._user.uid !== user.uid) {
      // eslint-disable-next-line no-underscore-dangle
      this._user = user;
      this.user$.next(user);
    }
  }
}

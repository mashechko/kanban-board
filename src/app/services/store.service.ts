import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, ReplaySubject } from 'rxjs';
import firebase from 'firebase';

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  public user$: ReplaySubject<firebase.User> = new ReplaySubject<firebase.User>(1);

  private _user: firebase.User;

  public get user(): firebase.User {
    // eslint-disable-next-line no-underscore-dangle
    return this._user;
  }

  public set user(user: firebase.User) {
    // eslint-disable-next-line no-underscore-dangle
    if (!this._user || this._user.uid !== user.uid) {
      // eslint-disable-next-line no-underscore-dangle
      this._user = user;
      this.user$.next(user);
    }
  }
}

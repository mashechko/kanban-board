import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { from, Observable, of } from 'rxjs';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { switchMap, take, tap } from 'rxjs/operators';
import firebase from 'firebase';
import { User } from '../user-interface';
import { StoreService } from './store.service';
import auth = firebase.auth;

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public user$: User;

  constructor(
    private afAuth: AngularFireAuth,
    private afs: AngularFirestore,
    private storeService: StoreService,
  ) {
    this.afAuth.authState
      .pipe(
        tap((user: firebase.User) => {
          this.storeService.user = user;
        }),
        switchMap((user: firebase.User) => {
          // Logged in
          if (user) {
            return this.afs.doc<firebase.User>(`users/${user.uid}`).valueChanges();
          }
          // Logged out
          return of(null);
        }),
      )
      .subscribe();
  }

  public googleSign(): Observable<auth.UserCredential> {
    const provider = new auth.GoogleAuthProvider();
    return from(this.afAuth.signInWithPopup(provider)).pipe(
      tap((userCred: auth.UserCredential) => {
        this.updateUserData(userCred.user);
      }),
      take(1),
    );
  }

  private updateUserData(user) {
    const userRef: AngularFirestoreDocument<User> = this.afs.doc(`users/${user.uid}`);

    const data = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
    };

    return userRef.set(data, { merge: true });
  }

  public signOut(): Observable<void> {
    return from(this.afAuth.signOut()).pipe(take(1));
  }
}

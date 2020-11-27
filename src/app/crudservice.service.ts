import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {from, Observable} from 'rxjs';
import {map, take} from 'rxjs/operators';
import firebase from 'firebase';
import DocumentReference = firebase.firestore.DocumentReference;
import firestore = firebase.firestore;

@Injectable({
  providedIn: 'root'
})
export class CRUDService {

  constructor(private firestoreService: AngularFirestore) { }

  public createEntity(collectionName: string, data: {}): Observable<string> {
    return from(this.firestoreService.collection(collectionName).add(data)).pipe(
      map((value: DocumentReference ) => value.id),
      take(1)
    );
  }

  public getData<T>(collectionName: string): Observable<T[]> {

    return this.firestoreService.collection(collectionName, ref => {
      const query: firestore.Query = ref;
      return query.where('name', '==', 'Harry Potter');
    }).snapshotChanges().pipe(
      map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const id = a.payload.doc.id;
        // @ts-ignore
        return { id, ...data } as T;
      })));
  }
}


import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { from, Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import firebase from 'firebase';
import firestore = firebase.firestore;
import DocumentReference = firebase.firestore.DocumentReference;

@Injectable({
  providedIn: 'root',
})
export class CRUDService {
  constructor(private firestoreService: AngularFirestore) {}

  public createEntity(collectionName: string, data): Observable<string> {
    if (!('id' in data)) {
      // eslint-disable-next-line no-param-reassign
      data.id = this.firestoreService.createId();
    }
    return from(this.firestoreService.collection(collectionName).add(data)).pipe(
      map((value: DocumentReference) => value.id),
      take(1),
    );
  }

  public getCollection<T>(collectionName: string): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName)
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data = a.payload.doc.data();
            const { id } = a.payload.doc;
            // @ts-ignore
            return { id, ...data } as T;
          }),
        ),
      );
  }

  public getElementsByProperty<T>(
    collectionName: string,
    property: string,
    propName: string,
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.where(property, '==', propName);
      })
      .snapshotChanges()
      .pipe(
        map((actions) =>
          actions.map((a) => {
            const data: any = a.payload.doc.data();
            const { id } = a.payload.doc;
            return { id, ...data } as T;
          }),
        ),
      );
  }

  public getElementByID(collection: string, id: string) {
    return from(this.firestoreService.collection(collection).doc(id).ref.get());
  }

  public updateObject(collectionName: string, id: string, obj: object): Observable<void> {
    return from(
      this.firestoreService
        .collection(collectionName)
        .doc(id)
        .set({ ...obj }, { merge: true }),
    ).pipe(take(1));
  }

  public deleteObject(collectionName: string, id: string): Observable<void> {
    return from(this.firestoreService.collection(collectionName).doc(id).delete()).pipe(take(1));
  }
}

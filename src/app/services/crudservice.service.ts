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

  public getCollectionWithOrder<T>(
    collectionName: string,
    orderField: string,
    orderAsc: boolean = true,
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.orderBy(orderField, orderAsc ? 'asc' : 'desc');
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

  public getElementsByProperty<T>(
    collectionName: string,
    property: string,
    propName: string,
    orderField?: string,
    orderAsc: boolean = true,
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.where(property, '==', propName).orderBy(orderField, orderAsc ? 'asc' : 'desc');
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

  public getElementsOfArray<T>(
    collectionName: string,
    property: string,
    values: string[],
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        return query.where(property, 'in', values);
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

  public getElementById(collectionName: string, ID: string) {
    return from(this.firestoreService.collection(collectionName).doc(ID).get()).pipe(
      map((value) => value.data()),
      take(1),
    );
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

  public getElementsWithLimit<T>(
    collectionName: string,
    order: string,
    orderAsc: boolean = true,
    limit: number,
    startAt?: any,
    endAt?: any,
  ): Observable<T[]> {
    return this.firestoreService
      .collection(collectionName, (ref) => {
        const query: firestore.Query = ref;
        if (startAt) {
          return query
            .orderBy(order, orderAsc ? 'asc' : 'desc')
            .startAt(startAt)
            .limit(limit + 1);
        }
        if (endAt) {
          return query
            .orderBy(order, orderAsc ? 'asc' : 'desc')
            .endAt(endAt)
            .limit(limit + 1);
        }
        return query.orderBy(order, orderAsc ? 'asc' : 'desc').limit(limit + 1);
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
}

import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable()
export class TriggerSubjectService {
  private subject = new Subject<any>();

  sendMessage(message: string): void {
    this.subject.next({ text: message });
  }

  clearMessage(): void {
    this.subject.next();
  }

  getMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}

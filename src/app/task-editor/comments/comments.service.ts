import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CommentsService {
  comments: string[] = [];

  add(comment: string) {
    this.comments.push(comment);
  }
}

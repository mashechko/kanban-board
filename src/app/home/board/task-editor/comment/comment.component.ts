import { Component, Input, OnInit } from '@angular/core';
import { CommentInterface } from './comment-interface';

@Component({
  selector: 'app-comment',
  templateUrl: './comment.component.html',
  styleUrls: ['./comment.component.css'],
})
export class CommentComponent implements OnInit {
  @Input() comment: CommentInterface;

  public context: string;

  public status: string;

  ngOnInit(): void {
    this.checkStatus();
  }

  private checkStatus() {
    if (this.comment.content.indexOf('ready to dev') !== -1) {
      this.splitContext('ready to dev');
    } else if (this.comment.content.indexOf('in development') !== -1) {
      this.splitContext('in development');
    } else if (this.comment.content.indexOf('in qa') !== -1) {
      this.splitContext('in qa');
    } else if (this.comment.content.indexOf('closed') !== -1) {
      this.splitContext('closed');
    } else if (this.comment.content.indexOf('Low Priority') !== -1) {
      this.splitContext('Low Priority');
    } else if (this.comment.content.indexOf('Med Priority') !== -1) {
      this.splitContext('Med Priority');
    } else if (this.comment.content.indexOf('High Priority') !== -1) {
      this.splitContext('High Priority');
    }
  }

  private splitContext(context: string) {
    const index = this.comment.content.indexOf(context);
    this.status = this.comment.content.substring(index);
    this.context = this.comment.content.substring(0, index);
  }
}

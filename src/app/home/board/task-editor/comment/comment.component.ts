import { Component, Input, OnInit } from '@angular/core';
import { CRUDService } from '../../../../services/crudservice.service';
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
    if (this.comment.content.indexOf('ready to development') !== -1) {
      this.splitContext('ready to development');
    } else if (this.comment.content.indexOf('in development') !== -1) {
      this.splitContext('in development');
    } else if (this.comment.content.indexOf('in qa') !== -1) {
      this.splitContext('in qa');
    } else if (this.comment.content.indexOf('closed') !== -1) {
      this.splitContext('closed');
    }
  }

  private splitContext(context: string) {
    const index = this.comment.content.indexOf(context);
    this.status = this.comment.content.substring(index);
    this.context = this.comment.content.substring(0, index);
  }
}

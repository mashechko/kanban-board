import { Component, Input, OnInit } from '@angular/core';
import { CRUDService } from '../../../services/crudservice.service';
import { User } from '../../../user-interface';

@Component({
  selector: 'app-project-dev',
  templateUrl: './project-dev.component.html',
  styleUrls: ['./project-dev.component.css'],
})
export class ProjectDevComponent implements OnInit {
  @Input() userUid: string;

  public user: User;

  constructor(private crud: CRUDService) {}

  ngOnInit(): void {
    this.getUser();
  }

  private getUser() {
    this.crud.getElementById('users', this.userUid).subscribe((value: User) => {
      this.user = value;
    });
  }
}

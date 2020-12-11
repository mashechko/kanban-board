import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { TaskService } from '../services/task.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.css'],
})
export class BoardComponent implements OnInit {
  public columns: string[] = ['ready to dev', 'in development', 'in qa', 'closed'];

  public user: string;

  constructor(private taskService: TaskService, private auth: AuthService) {}

  ngOnInit(): void {
    this.getCurrentUser();
  }

  private getCurrentUser() {
    return this.auth.user$.pipe(map((value) => value.displayName)).subscribe((user) => {
      this.user = user;
    });
  }

  public showDialog(status, user) {
    this.taskService.createTask(status, user);
  }
}

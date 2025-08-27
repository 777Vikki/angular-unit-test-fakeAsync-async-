import { Component, inject, OnInit } from '@angular/core';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss'
})
export class UserComponent implements OnInit{
  userService = inject(UserService);
  users: any[] = [];

  ngOnInit(): void {
    this.userService.getUser()
      .subscribe(userList => {
        this.users = userList;
      });
  }
}

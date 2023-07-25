import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  user: User = { username: '', password: '' };
  displayDialog = false;
  isNewUser = false;

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  showDialogToAdd() {
    this.isNewUser = true;
    this.displayDialog = true;
  }

  editUser(user: User) {
    this.isNewUser = false;
    this.user = { ...user };
    this.displayDialog = true;
  }

  saveUser() {
    if (this.isNewUser) {
      this.userService.createUser(this.user).subscribe(
        () => {
          this.loadUsers();
          this.displayDialog = false;
        },
        error => {
          console.error('Error adding user:', error);
        }
      );
    } else {
      this.userService.updateUser(this.user.id!, this.user).subscribe(
        () => {
          this.loadUsers();
          this.displayDialog = false;
        },
        error => {
          console.error('Error updating user:', error);
        }
      );
    }
  }

  deleteUser(user: User) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id!).subscribe(
        () => {
          this.loadUsers();
        },
        error => {
          console.error('Error deleting user:', error);
        }
      );
    }
  }

  cancel() {
    this.displayDialog = false;
    this.user = { username: '', password: '' };
  }
}

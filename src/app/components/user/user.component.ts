import { Component, OnInit } from '@angular/core';
import { User } from '../../models/user.model';
import { UserService } from 'src/app/service/user.service';
import { Role } from 'src/app/models/role.model';
import { RoleService } from 'src/app/service/role.service';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MessageService } from 'primeng/api';
import {Utils} from "../../utils/utils";

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  users: User[] = [];
  user: User = { username: '', password: '', roles: [] };
  displayDialog = false;
  isNewUser = false;
  roles: Role[] = [];
  userForm!: FormGroup;
  selectedUser: User | null = null;

  constructor(
    private userService: UserService,
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService // Inject MessageService here
  ) { }

  ngOnInit() {
    this.loadUsers();
    this.loadRoles();
    this.initUserForm();
  }

  loadRoles() {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (data: User[]) => {
        this.users = data;
      },
      error: (error: any) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users.' + error.message,
        });
      }
    });
  }

  initUserForm(): void {
    this.userForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
      roles: [[]]
    });
  }

  showDialogToAdd() {
    this.isNewUser = true;
    this.selectedUser = null;
    this.userForm.reset();
    this.displayDialog = true;
  }

  showEditDialog(user: User) {
    this.isNewUser = false;
    this.selectedUser = { ...user };
    this.userForm.patchValue({
      username: user.username,
      password: user.password,
      roles: user.roles
    });
    this.displayDialog = true;
  }

  saveUser() {
    if (this.userForm.invalid) {
      Utils.checkForUntouched(this.userForm);
      this.messageService.add({
        severity: 'warn',
        summary: 'Warning',
        detail: 'Please fill in all required fields correctly.',
      });
      return;
    }

    const user: User = {
      username: this.userForm.value.username,
      password: this.userForm.value.password,
      roles: this.userForm.value.roles
    };

    if (this.isNewUser) {
      this.userService.createUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User created successfully!',
          });
        },
        error: (error: any) => {
          console.error('Error adding user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create user.' + error.message,
          });
        },
      });

    } else {
      user.id = this.selectedUser?.id;
      this.userService.updateUser(user).subscribe({
        next: () => {
          this.loadUsers();
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User updated successfully!'
          });
        },
        error: (error: any) => {
          console.error('Error updating user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update user.' + error.message,
          });
        }
      });
    }
  }

  deleteUser(user: User) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userService.deleteUser(user.id!).subscribe({
        next: () => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'User deleted successfully!'
          });
        },
        error: (error: any) => {
          console.error('Error deleting user:', error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to delete user.' + error.message,
          });
        }
      });

    }
  }

  cancel() {
    this.displayDialog = false;
    this.userForm.reset();
  }
}

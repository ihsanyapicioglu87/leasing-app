import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MessageService} from 'primeng/api';
import {Role} from '../../models/role.model';
import {RoleService} from '../../service/role.service';
import {ConfirmationService} from 'primeng/api';

@Component({
  selector: 'app-role',
  templateUrl: './role.component.html',
  styleUrls: ['./role.component.css']
})
export class RoleComponent implements OnInit {
  roles: Role[] = [];
  roleForm!: FormGroup;
  displayDialog: boolean = false;
  isNewRole: boolean = false;
  role: Role = {name: ''};

  constructor(
    private roleService: RoleService,
    private formBuilder: FormBuilder,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
  ) {
  }

  ngOnInit(): void {
    this.loadRoles();
    this.initRoleForm();
  }

  loadRoles(): void {
    this.roleService.getRoles().subscribe((roles) => {
      this.roles = roles;
    });
  }

  initRoleForm(): void {
    this.roleForm = this.formBuilder.group({
      id: [''],
      name: ['', Validators.required]
    });
  }

  showDialogToAdd(): void {
    this.isNewRole = true;
    this.roleForm.reset();
    this.displayDialog = true;
  }

  editRole(role: Role): void {
    this.isNewRole = false;
    this.role = {...role};
    this.roleForm.patchValue(this.role);
    this.displayDialog = true;
  }

  saveRole(): void {
    const role = this.roleForm.value;
    if (this.isNewRole) {
      this.roleService.addRole(role).subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Role added successfully!'
        });
        this.loadRoles();
        this.displayDialog = false;
      });
    } else {
      if (this.role) {
        role.id = this.role.id;
        this.roleService.updateRole(role).subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Role updated successfully!'
          });
          this.loadRoles();
          this.displayDialog = false;
        });
      }
    }
  }

  deleteRole(roleId: number): void {
    this.confirmDelete().then((result) => {
      if (result) {
        this.roleService.deleteRole(roleId).subscribe({
          next: () => {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Role deleted successfully!'});
            this.loadRoles();
          },
          error: (error: any) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to delete role.' + error.message,
            });
          }
        });

      }
    });
  }

  confirmDelete(): Promise<boolean> {
    return new Promise((resolve) => {
      this.confirmationService.confirm({
        message: 'Are you sure you want to delete this role?',
        accept: () => {
          resolve(true);
        },
        reject: () => {
          resolve(false);
        }
      });
    });
  }

  cancel() {
    this.displayDialog = false;
    this.role = {name: ''};
    this.roleForm.reset();
  }
}

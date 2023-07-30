import {FormGroup} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HttpHeaders} from "@angular/common/http";
import {User} from "../models/user.model";
import {Role} from "../models/role.model";

export const BASE_URL = 'http://localhost:8080/api';
export class Utils {
  static checkForUntouched(form : FormGroup) {
    Object.keys(form.controls).forEach(field => {
      const control = form.get(field);
      control?.markAsTouched({ onlySelf: true });
    });
  }
  static addInvalidFormMessage(messageService: MessageService) {
    messageService.add({
      severity: 'warn',
      summary: 'Warning',
      detail: 'Please fill in all required fields correctly.',
    });
  }

 static getHttpOptions() {
    return {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  static getUser(): User | null {
    const loggedInUserJson = localStorage.getItem('loggedInUser');
    if (loggedInUserJson) {
      return JSON.parse(loggedInUserJson);
    }
    return null;
  }

  static hasRole(role: string): boolean {
    const loggedInUser: any  = Utils.getUser();

    if (loggedInUser && loggedInUser.user && loggedInUser.user.roles && Array.isArray(loggedInUser.user.roles)) {
      return loggedInUser.user.roles.find((userRole: Role) => userRole.name === role) !== undefined;
    }

    return false;
  }

  static getLoggedInUserName(): string | null {
    const loggedInUser: any | null = Utils.getUser();
    return loggedInUser.user.username || null;
  }

}


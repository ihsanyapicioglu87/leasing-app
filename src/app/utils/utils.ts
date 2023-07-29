import {OnInit} from "@angular/core";
import {FormGroup} from "@angular/forms";
import {MessageService} from "primeng/api";
import {HttpHeaders} from "@angular/common/http";

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
}


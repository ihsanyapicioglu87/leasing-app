import {ChangeDetectorRef, Component, Injectable} from '@angular/core';
import {AuthService} from '../service/auth.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Utils} from "../utils/utils";
import {MessageService} from "primeng/api";

@Injectable({
  providedIn: 'root',
})

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(private authService: AuthService, private cdr: ChangeDetectorRef, private formBuilder: FormBuilder,
              private messageService: MessageService) {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginClick() {
    if (this.loginForm.invalid) {
      if (this.loginForm.invalid) {
        Utils.checkForUntouched(this.loginForm);
        Utils.addInvalidFormMessage(this.messageService);
        return;
      }
      return;
    }

    const {username, password} = this.loginForm.value;
    this.authService.login(username, password)
    if (localStorage.getItem("loggedInUser")) {

      console.log('Login successful!');
      this.cdr.detectChanges();
    }
  }
}

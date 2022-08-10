import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { defer, EMPTY, switchMap } from 'rxjs';
import { AuthService } from '../authentication/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  loginForm: FormGroup;

  get loginData() {
    return this.loginForm.value;
  }

  constructor(private fb: FormBuilder, private authService: AuthService) {
    this.loginForm = this.fb.group({
      account: ['eddylin', Validators.required],
      password: ['password', Validators.required],
    });
  }

  ngOnInit(): void { }

  onLogin() {
    console.log(this.authService.token);
    this.authService.userLogin(this.loginData).pipe(
      switchMap(({accessToken}) => this.authService.queryUserInfoByAuth()),
    ).subscribe((res) => {
      console.log(res);
      console.log(this.authService.token);
    });
  }
}

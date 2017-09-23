import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './../auth/auth.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginFormGroup: FormGroup;
  constructor(private auth: AuthService, private router: Router) { }

  ngOnInit() {
    if(this.auth.isAuthenticated()){
      this.router.navigate(['/home']);
    }
    this.loginFormGroup = new FormGroup({
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, Validators.required)
    });
  }

  login() {
    this.auth.setLoginInProgress(true);
    this.auth.clearLoginMessage();
    this.auth.login(this.loginFormGroup.get('email').value, this.loginFormGroup.get('password').value);
  }
}

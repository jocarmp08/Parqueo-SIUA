import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  // Login form
  private loginForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      const values = Object.assign({}, this.loginForm.value);
      this.authService.login(values.email, values.password);
    }
  }

}

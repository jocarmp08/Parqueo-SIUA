import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

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

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  login() {
    if (this.loginForm.valid) {
      const values = Object.assign({}, this.loginForm.value);
      console.log(values.email);
      console.log(values.password);
    }
  }

}

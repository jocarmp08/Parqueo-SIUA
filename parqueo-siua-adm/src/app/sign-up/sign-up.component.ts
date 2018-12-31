import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  // Sign up form
  private signUpForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder) {
  }

  ngOnInit() {
  }

  signup() {
    if (this.signUpForm.valid) {
      const values = Object.assign({}, this.signUpForm.value);
      console.log(values.email);
      console.log(values.password);
    }
  }
}



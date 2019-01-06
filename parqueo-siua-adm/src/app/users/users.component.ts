import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../auth/auth.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  usersArray = [
    {
      'email': 'prueba@siua.ac.cr',
    }
  ];

  private loginForm = this.formBuilder.group({
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
  }

  createUser() {
    if (this.loginForm.valid) {
      const values = Object.assign({}, this.loginForm.value);
      const user = {
        'email': values.email,
        'password': values.password
      };
      this.authService.postUser(user).subscribe((data) => {
        this.showOutputMessage('El usuario fue creado con éxito', 'Aceptar');
      });
    }
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}

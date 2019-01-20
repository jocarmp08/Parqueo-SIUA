import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from '@angular/forms';
import {AuthService} from '../../auth/auth.service';
import {MatSnackBar} from '@angular/material';
import {UserModel} from '../../models/user.model';
import {Observable} from 'rxjs';
import {SharedService} from '../../shared/shared.service';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  private usersArray: Array<UserModel>;

  private userForm = this.formBuilder.group({
    name: [null, Validators.required],
    email: [null, [Validators.required, Validators.email]],
    password: [null, Validators.required]
  });

  constructor(private formBuilder: FormBuilder, private authService: AuthService, private sharedService: SharedService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    this.getUsers();
  }

  private getUsers() {
    this.authService.getUsers().subscribe((data: Array<UserModel>) => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === localStorage.getItem('email')) {
          data.splice(i, 1);
        }
      }
      this.usersArray = data;
      this.sortUserArray();
    });
  }

  private createUser() {
    const values = Object.assign({}, this.userForm.value);
    const user = {
      'name': values.name,
      'email': values.email,
      'password': values.password
    };
    this.authService.postUser(user).subscribe((data) => {
      this.showOutputMessage('El usuario fue creado con éxito', 'Aceptar');
      this.usersArray.push(data);
      this.sortUserArray();
      this.userForm.reset();
    }, error => {
      this.showOutputMessage('Ocurrió un error al crear el usuario, intente de nuevo', 'Aceptar');
    });
  }

  private deleteUser(userToDelete: UserModel) {
    this.showDialogConfirmation().subscribe(result => {
      // User confirmed deletion
      if (result) {
        // Get ID
        const id = userToDelete.id;
        // Call REST API
        this.authService.deleteUser(id).subscribe((data) => {
          // Show output message
          this.showOutputMessage(userToDelete.email + ' se ha eliminado correctamente', 'Aceptar');
          // Update news array
          this.usersArray.splice(this.usersArray.indexOf(userToDelete), 1);
        }, (error) => {
          this.showOutputMessage('Ocurrió un error al eliminar el usuario, intente de nuevo', 'Aceptar');
        });
      }
    });

  }

  private sortUserArray() {
    this.usersArray = this.usersArray.sort((obj1, obj2) => {
      const a = obj1.name.toLowerCase();
      const b = obj2.name.toLowerCase();
      return a < b ? -1 : a > b ? 1 : 0;
    });
  }

  private showDialogConfirmation(): Observable<boolean> {
    // Prepare messages
    const title = 'Confirmar eliminación';
    const message = '¿Eliminar este usuario?';

    return this.sharedService.showConfirmationDialog(title, message);
  }

  private showOutputMessage(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

}

import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService {
  endpoint = 'http://167.99.240.71:3000/api/';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string) {
    this.http.post(this.endpoint + 'Users/login', {email: email, password: password})
      .subscribe((resp: any) => {
        localStorage.setItem('auth_token', resp.id);
        localStorage.setItem('email', email);
        this.router.navigate(['']);
      });
  }

  logout() {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('email');
    this.router.navigate(['login']);
  }

  loggedIn() {
    return localStorage.getItem('auth_token') != null;
  }

  isSU() {
    return localStorage.getItem('email') === 'superusuario@siua.ac.cr';
  }
}

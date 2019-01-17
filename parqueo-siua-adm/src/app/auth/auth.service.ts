import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

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
      }, error => {
        console.log('ERROR');
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

  postUser(user): Observable<any> {
    const url = this.endpoint + 'Users';
    return this.http.post(url, user).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}

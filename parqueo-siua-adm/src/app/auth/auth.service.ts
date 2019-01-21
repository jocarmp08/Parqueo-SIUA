import {Injectable} from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import {Router} from '@angular/router';
import {map} from 'rxjs/operators';
import {Observable} from 'rxjs';

@Injectable({providedIn: 'root'})
export class AuthService {

  endpoint = 'http://167.99.240.71:3000/api/';

  constructor(private http: HttpClient, private router: Router) {
  }

  login(email: string, password: string) {
    this.http.post(this.endpoint + 'accounts/login', {email: email, password: password})
      .subscribe((resp: any) => {
        localStorage.setItem('auth_token', resp.id);
        localStorage.setItem('email', email);

        // Get username
        let params = new HttpParams();
        params = params.set('filter[where][id]', resp.userId);
        this.http.get(this.endpoint + 'accounts/', {params: params}).subscribe((data: any) => {
          localStorage.setItem('username', data[0].name);
          this.router.navigate(['']);
        });
      });
  }

  logout() {
    let params = new HttpParams();
    params = params.set('access_token', localStorage.getItem('auth_token'));
    this.http.post(this.endpoint + 'accounts/logout', {}, {params: params}).subscribe((resp: any) => {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('email');
      localStorage.removeItem('username');
      this.router.navigate(['login']);
    });
  }

  loggedIn() {
    return localStorage.getItem('auth_token') != null;
  }

  isSU() {
    return localStorage.getItem('email') === 'su@siua.ac.cr';
  }

  postUser(user): Observable<any> {
    const url = this.endpoint + 'accounts';
    return this.http.post(url, user).pipe(map(this.extractData));
  }

  deleteUser(id: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('access_token', localStorage.getItem('auth_token'));
    return this.http.delete(this.endpoint + 'accounts/' + id, {params: params}).pipe(map(this.extractData));
  }

  changePassword(oldPassword: string, newPassword: string): Observable<any> {
    let params = new HttpParams();
    params = params.set('access_token', localStorage.getItem('auth_token'));
    const body = {
      'oldPassword': oldPassword,
      'newPassword': newPassword
    };
    return this.http.post(this.endpoint + 'accounts/change-password', body, {params: params}).pipe(map(this.extractData));
  }

  getUsers(): Observable<any> {
    const url = this.endpoint + 'accounts';
    return this.http.get(url).pipe(map(this.extractData));
  }

  private extractData(res: Response) {
    return res || {};
  }
}

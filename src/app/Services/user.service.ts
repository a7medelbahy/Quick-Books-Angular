import { HttpClient, HttpEvent, HttpHandler, HttpRequest } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { Observable, Subject, tap } from 'rxjs';
import { Login } from '../Models/login.model';
import { Registeration } from '../Models/Registeration.model';
import { AuthModel } from '../Models/auth.model';

const baseUrl: string = "http://localhost:5096/Api/Auth/";
@Injectable({
  providedIn: 'root'
})
export class UserService {
  readonly loggedIn = signal<boolean | undefined>(false);
  private readonly http: HttpClient = inject(HttpClient);

  user = {
    user_id: localStorage.getItem('userId'),
    user_name: localStorage.getItem('userName'),
    user_token: localStorage.getItem('token'),
  };
  
  //intercept(
  //  req: HttpRequest<any>,
  //  next: HttpHandler
  //): Observable<HttpEvent<any>> {
  //  throw new Error('Method not implemented.');
  //}

  createUser(user: Registeration) {
    const action: String = 'register';
    return this.http.post<AuthModel>(baseUrl + action, user);
  }
  
  login(loginModel: Login) {
    const action: string = 'login'; 
    return this.http.post<AuthModel>(baseUrl + action, loginModel).pipe(
        tap((response: AuthModel) => {
            if (response.isAuthenticated) {
                localStorage.setItem('token', response.token);
                localStorage.setItem('userName', response.username);
                this.loggedIn.set(true);
                this.user.user_token = response.token;
                this.user.user_name = response.username;
            }
        })
    );
  };

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.loggedIn.set(false);
}

}

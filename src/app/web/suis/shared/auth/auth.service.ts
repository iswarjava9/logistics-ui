import { Auth } from './../../models/auth.model';
import { User } from './../../models/user.model';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import { ConfigService } from './../../services/config.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthService {
  HOST = '';
  headers: Headers = new Headers();
  options: RequestOptions;
  user = User;
  loginMessage: string;
  isLoginInProcess = false;
/* 
  auth0 = new auth0.WebAuth({
    clientID: AUTH_CONFIG.clientID,
    domain: AUTH_CONFIG.domain,
    responseType: 'token id_token',
    audience: `https://${AUTH_CONFIG.domain}/userinfo`,
    redirectUri: 'http://localhost:4200/callback',
    scope: 'openid'
  }); */

  constructor(public router: Router, private configSvc: ConfigService, private http: Http) {
    this.HOST = configSvc.getConfiguration().baseUrl;
  }

  public login(username: string, password: string): void {
    this.isLoginInProcess = true;
    //this.auth0.authorize();
    this.headers = new Headers();
    this.headers.append('username', username);
    this.headers.append('password', password);
    this.options = new RequestOptions({headers: this.headers});
    this.http.get(this.HOST + '/logistics/authentication/login', this.options).subscribe(
      (response) =>{
        this.isLoginInProcess = false;
        this.setSession(response.json());
        this.router.navigate(['/home']);
      },
      (error) => {
        this.isLoginInProcess = false;
        this.loginMessage = 'User name or password is not valid!';
        this.router.navigate(['/login'])
      }
    );
  }

  /* public handleAuthentication(): void {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.accessToken && authResult.idToken) {
        console.log('Authenticated..');
        window.location.hash = '';
        this.setSession(authResult);
        this.router.navigate(['/home']);
      } else if (err) {
        console.log('NOT Authenticated..');
        this.router.navigate(['/login']);
        console.log(err);
        alert(`Error: ${err.error}. Check the console for further details.`);
      }
    });
  }
 */
  private setSession(authResult): void {
    // Set the time that the access token will expire at
    const expiresAt = JSON.stringify((authResult.expiresAt * 1000) + new Date().getTime());
    localStorage.setItem('access_token', authResult.accessToken);
    // localStorage.setItem('id_token', authResult.idToken);
    localStorage.setItem('expires_at', expiresAt);
    this.user = authResult.user;
   }

  public logout(): void {
    // Remove tokens and expiry time from localStorage
    localStorage.removeItem('access_token');
    localStorage.removeItem('id_token');
    localStorage.removeItem('expires_at');
    // Go back to the home route
    this.router.navigate(['/']);
  }

  public isAuthenticated(): boolean {
    // Check whether the current time is past the
    // access token's expiry time
    const expiresAt = JSON.parse(localStorage.getItem('expires_at'));
    if(expiresAt){
      return new Date().getTime() < expiresAt;
    }else{
      return false;
    }
  }

  getLoginMessage() {
    return this.loginMessage;
  }
  clearLoginMessage() {
    this.loginMessage = null;
  }
  isLoginInProgress(){
    return this.isLoginInProcess;
  }
  setLoginInProgress(isInProcess: boolean){
    this.isLoginInProcess = isInProcess;
  }
}

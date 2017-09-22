import { Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router} from '@angular/router';
import {AuthService} from './auth.service';

@Injectable()
export class AuthgaurdService implements CanActivate{

  constructor(private authService: AuthService, private router: Router) { }


  canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const isAuthenticated = this.authService.isAuthenticated();
    if(!isAuthenticated){
      this.router.navigate(['/login']);
    }
    return isAuthenticated;
    }
    
}

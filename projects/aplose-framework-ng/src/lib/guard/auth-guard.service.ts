import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  

  constructor(private _router: Router, private _authService: AuthenticationService) {
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>{
    console.log('IS LOGED:', this._authService.isLoged());
    
    if(this._authService.isLoged()){
      return true;
    }
    this._router.navigate(['/login'], {queryParams: {returnUrl: state.url}});
    return false;
  }
}

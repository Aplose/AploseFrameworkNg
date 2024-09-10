import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../../public-api';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  

  constructor(private _router: Router, private _authService: AuthenticationService) {
  }


  public canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>{

    return this._authService.isLoged$().pipe(
      tap((isLoged) => {
        console.log('IS LOGED:', isLoged);
        if (!isLoged) {
          this._router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
        }
      }),
      map(isLoged => isLoged)
    );
  }
}

import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { RoleService } from '../../public-api';
import { map, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {


  constructor(private router: Router, private _roleService: RoleService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>{

    return this._roleService.isInRole$(route.data['expectedRoles']).pipe(
      tap((isInRole: boolean) => {
        if( ! isInRole){
          this.router.navigate(['/not-in-role']);
        }
      }),
      map((isInRole: boolean) => isInRole)
    )
  }
}

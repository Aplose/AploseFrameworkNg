import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, GuardResult, MaybeAsync, Router, RouterStateSnapshot } from '@angular/router';
import { RoleService } from '../../public-api';

@Injectable({
  providedIn: 'root'
})
export class RoleGuardService {


  constructor(private router: Router, private _roleService: RoleService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult>{

    if(this._roleService.isInRole(route.data['expectedRoles'])){
      return true;
    }
    
    this.router.navigate(['/not-in-role']);
    return false;    
  }
}

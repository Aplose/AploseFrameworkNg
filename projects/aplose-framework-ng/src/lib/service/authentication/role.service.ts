import { Injectable } from '@angular/core';
import { UserAccount } from '../../model/UserAccount';
import { RoleEnum } from '../../enum/RoleEnum';

@Injectable({
  providedIn: 'root'
})
export class RoleService {

  public getRoles(): string[]{
    const roles: string | null =  localStorage.getItem('user-authorities');
    console.log('getRole:', roles);
    
    return roles === null ?
        []
        :
        roles.split(';');
}


public setRoles(userAccount: UserAccount){
    let rolesSTR: string = '';
    userAccount.authorities.map(role => {
        rolesSTR += role.authority + ';';
    })
    localStorage.setItem('user-authorities', rolesSTR);
}


public deleteRoles(): void{
    localStorage.removeItem('user-authorities');
}


public isInRole = (espectedRoles: string[]): boolean => {
    const roles = this.getRoles()
    return (roles.length > 0 && roles.length > 0) ?
    roles.reduce((acc, role) => espectedRoles.includes(role) ? true : acc, false)
    :
    false;
}


public isInRoleSuperAdmin = (): boolean => this.getRoles().reduce(
    (acc, role) => role === RoleEnum.ROLE_SUPER_ADMIN ? true : acc,
    false
)

public isInRoleProfessional = (): boolean => {
    
    return this.getRoles().reduce(
    (acc, role) => {console.log(role, '--', RoleEnum.ROLE_PROFESSIONAL); return role === RoleEnum.ROLE_PROFESSIONAL ? true : acc},
    false
)}

public isInRoleAccountingManager = (): boolean => this.getRoles().reduce(
    (acc, role) => role === RoleEnum.ROLE_ACCOUNTING_MANAGER ? true : acc,
    false
)

public isInRoleAppointmentManager = (): boolean => this.getRoles().reduce(
    (acc, role) => role === RoleEnum.ROLE_APPOINTMENT_MANAGER ? true : acc,
    false
)
}

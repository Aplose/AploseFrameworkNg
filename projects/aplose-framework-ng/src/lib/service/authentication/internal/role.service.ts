import { Injectable, OnInit } from '@angular/core';
import { UserAccount } from '../../../model/UserAccount';
import { RoleEnum } from '../../../enum/RoleEnum';
import { from, map, Observable } from 'rxjs';
import { aploseDatabase } from '../../../config/indexedDB/AploseDatabase';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements OnInit {
    private readonly storename: string = 'authentication';
    private readonly keyname: string = 'role';

    ngOnInit(): void {}

    public getRoles$(): Observable<string[]> {
        return from(aploseDatabase.authentication.get(this.keyname)).pipe(
            map((role: { key: string, value: string } | undefined) => 
                role?.value ? role.value.split(';') : []
            )
        );
    }

    public setRoles(userAccount: UserAccount): void {
        const rolesSTR = userAccount.authorities
            .map(role => role.authority)
            .join(';');

        aploseDatabase.authentication.put({
            key: this.keyname,
            value: rolesSTR
        });
    }

    public deleteRoles(): void {
        aploseDatabase.authentication.delete(this.keyname);
    }

    public isInRole$ = (expectedRoles: string[]): Observable<boolean> => {
        return this.getRoles$().pipe(
            map((roles: string[]) => {
                return (roles.length > 0 && expectedRoles.length > 0) ?
                    roles.reduce((acc, role) => expectedRoles.includes(role) ? true : acc, false)
                    : false;
            })
        );
    }


    public isInRoleSuperAdmin$ = (): Observable<boolean> => this.getRoles$().pipe(
        map((roles: string[]) => roles.reduce((acc, role) => role === RoleEnum.ROLE_SUPER_ADMIN ? true : acc, false))
    )

    public isInRoleProfessional$ = (): Observable<boolean> => this.getRoles$().pipe(
        map((roles: string[]) => roles.reduce((acc, role) => role === RoleEnum.ROLE_PROFESSIONAL ? true : acc, false))
    )

    public isInRoleAccountingManager$ = (): Observable<boolean> => this.getRoles$().pipe(
        map((roles: string[]) => roles.reduce((acc, role) => role === RoleEnum.ROLE_ACCOUNTING_MANAGER ? true : acc, false))
    )

    public isInRoleAppointmentManager$ = (): Observable<boolean> => this.getRoles$().pipe(
        map((roles: string[]) => roles.reduce( (acc, role) => role === RoleEnum.ROLE_APPOINTMENT_MANAGER ? true : acc, false))
    )
    
    
    
}

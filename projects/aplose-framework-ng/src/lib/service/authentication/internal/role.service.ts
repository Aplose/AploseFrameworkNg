import { Injectable, OnInit } from '@angular/core';
import { UserAccount } from '../../../model/UserAccount';
import { RoleEnum } from '../../../enum/RoleEnum';
import { from, map, Observable } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class RoleService implements OnInit{


    private readonly storename: string = 'authentication';
    private readonly keyname: string = 'role';



    constructor(private _indexedDBService: NgxIndexedDBService){}


    ngOnInit(): void {

    }


    public getRoles$(): Observable<string[]>{
        this._indexedDBService.selectDb('AploseFrameworkNg')
        return from(this._indexedDBService.getByKey<{key: string, value: string}>(this.storename, this.keyname).pipe(
            map((rolesSTR: {key: string, value: string}) => rolesSTR.value == null ? [] : rolesSTR.value.split(';')))
        )
    }


    public setRoles(userAccount: UserAccount): void{
        this._indexedDBService.selectDb('AploseFrameworkNg')
        let rolesSTR: string = '';
        userAccount.authorities.map(role => {
            rolesSTR += role.authority + ';';
        })
        this._indexedDBService.add(this.storename, {key: this.keyname, value: rolesSTR}).subscribe()
    }


    public deleteRoles(): void{
        this._indexedDBService.selectDb('AploseFrameworkNg')
        this._indexedDBService.deleteByKey(this.storename, this.keyname).subscribe()
    }


    public isInRole$ = (espectedRoles: string[]): Observable<boolean> => {
        return this.getRoles$().pipe(
            map((roles: string[]) => {
                return (roles.length > 0 && roles.length > 0) ?
                    roles.reduce((acc, role) => espectedRoles.includes(role) ? true : acc, false)
                    :
                    false;
            })
        )
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

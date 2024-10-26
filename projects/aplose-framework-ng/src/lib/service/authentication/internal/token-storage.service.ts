import { Injectable } from '@angular/core';
import { Token } from '../../../model/Token';
import { map, Observable } from 'rxjs';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

    private readonly storename: string = 'authentication';
    private readonly keyname: string = 'token';


    constructor(
        private _indexedDBService: NgxIndexedDBService,
    ){}


    public getToken(): Observable<Token | null>{
        this._indexedDBService.selectDb('AploseFrameworkNg')
        return this._indexedDBService.getByKey<{key: string, value: Token} | undefined>(this.storename, this.keyname).pipe(
            map((token: {key: string, value: Token} | undefined) => {
                if(token == undefined){
                    return null;
                }
                return token.value;
            })
        )
    }

    public setToken(token: Token): void{
        this._indexedDBService.selectDb('AploseFrameworkNg')
        this._indexedDBService.add(this.storename, {key: this.keyname, value: token}).subscribe();
    }



    public deleteToken(){
        this._indexedDBService.selectDb('AploseFrameworkNg')
        this._indexedDBService.deleteByKey(this.storename, this.keyname).subscribe(()=>{console.log('token, role, logedUser deleted !')})

    }
}

import { Injectable } from '@angular/core';
import { Token } from '../../model/Token';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { map, Observable } from 'rxjs';

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

        return this._indexedDBService.getByKey<{key: string, value: Token} | undefined>(this.storename, this.keyname).pipe(
            map((token: {key: string, value: Token} | undefined) => {
                if(token){
                    return token.value;
                }
                return null;
            })
        )
    }

    public setToken(token: Token): void{
        this._indexedDBService.add(this.storename, {key: this.keyname, value: token}).subscribe();
    }



    public deleteToken(){
        this._indexedDBService.deleteByKey(this.storename, this.keyname).subscribe(()=>{console.log('token supprimé')})

    }
}

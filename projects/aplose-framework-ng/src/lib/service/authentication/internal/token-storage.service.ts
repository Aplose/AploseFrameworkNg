import { Injectable } from '@angular/core';
import { Token } from '../../../model/Token';
import { from, map, Observable } from 'rxjs';
import { aploseDatabase } from '../../../config/indexedDB/AploseDatabase';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {
    private readonly storename: string = 'authentication';
    private readonly keyname: string = 'token';

    public getToken(): Observable<Token | null> {
        return from(aploseDatabase.authentication.get(this.keyname)).pipe(
            map((item: { key: string, value: Token } | undefined) => {
                if (!item) {
                    return null;
                }
                return item.value;
            })
        );
    }

    public setToken(token: Token): void {
        aploseDatabase.authentication.put({
            key: this.keyname,
            value: token
        });
    }

    public deleteToken(): void {
        aploseDatabase.authentication.delete(this.keyname).then(() => {
            console.log('token, role, logedUser deleted !');
        });
    }
}

import { Injectable } from '@angular/core';
import { Token } from '../../model/Token';

@Injectable({
  providedIn: 'root'
})
export class TokenStorageService {

  public getToken(): Token | null{
    const token = localStorage.getItem('auth-token');
    if(token == null){
        return null;
    }
    return {
        accessToken: token,
        type: JSON.parse(localStorage.getItem('auth-token-type') ?? ''),
        expireAt: new Date(JSON.parse(localStorage.getItem('auth-token-expireAt') ?? ''))
    }
}

public setToken(token: Token): void{
    console.log('setToken:', token);
    
    localStorage.setItem('auth-token', token.accessToken);
    localStorage.setItem('auth-token-type', JSON.stringify(token.type));
    localStorage.setItem('auth-token-expireAt', JSON.stringify(token.expireAt));
}

public deleteToken(){
    localStorage.removeItem('auth-token');
    localStorage.removeItem('auth-token-type');
    localStorage.removeItem('auth-token-expireAt');
}
}

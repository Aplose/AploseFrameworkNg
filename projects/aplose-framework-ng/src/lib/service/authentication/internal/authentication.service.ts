import { Injectable } from '@angular/core';
import { AuthRequestDTO } from '../../../dto/AuthRequestDTO';
import { AuthResponseDTO } from '../../../dto/AuthResponseDTO';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../../config/config.service';
import { map, Observable, tap } from 'rxjs';
import { RoleService } from './role.service';
import { TokenStorageService } from './token-storage.service';
import { Token } from '../../../model/Token';
import { UserAccount } from '../../../model/UserAccount';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  private readonly storeName: string = 'authentication';
  private readonly keyName: string = 'userAccount';


  constructor(
    private _httpClient: HttpClient, 
    private _configService: ConfigService, 
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService,
    private _indexedDBService: NgxIndexedDBService
  ){}

  public login$(authRequestDto: AuthRequestDTO): Observable<AuthResponseDTO> {
      return  this._httpClient.post<AuthResponseDTO>(this._configService.backendUrl + "/authentication/internal-login", authRequestDto).pipe(
        tap((data: AuthResponseDTO) => {
          this._tokenStorageService.setToken(data.token);
          this._roleService.setRoles(data.userAccount);
          this.saveLogedUserAccount(data.userAccount)
        })
      );
  }


  public logout(): void{
    this._tokenStorageService.deleteToken(); 
    this.deleteLogedUserAccount();
    this._roleService.deleteRoles();
  }
    
  public isLoged$(): Observable<boolean>{
    return this._tokenStorageService.getToken().pipe(
      map((token: Token | null) => token ? true : false)
      // map((token: Token | null) => token && token.expireAt > Date.now() ? true : false)
    ) 
  };

  public saveLogedUserAccount(userAccount: UserAccount): void{
    this._indexedDBService.add(this.storeName, { key: this.keyName, value: userAccount}).subscribe();
  }

  public getLogedUserAccount$(): Observable<UserAccount | null>{
    return this._indexedDBService.getByKey(this.storeName, this.keyName);
  }

  public deleteLogedUserAccount(): void{
    this._indexedDBService.delete(this.storeName, this.keyName).subscribe();
  }
}

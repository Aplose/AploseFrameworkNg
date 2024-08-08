import { Injectable } from '@angular/core';
import { AuthRequestDTO } from '../../dto/AuthRequestDTO';
import { AuthResponseDTO } from '../../dto/AuthResponseDTO';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../../config/config.service';
import { Observable, tap } from 'rxjs';
import { RoleService } from './role.service';
import { TokenStorageService } from './token-storage.service';
import { Token } from '../../model/Token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {



  constructor(
    private _httpClient: HttpClient, 
    private _configService: ConfigService, 
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService
  ){}

  
  public login$(authRequestDto: AuthRequestDTO): Observable<AuthResponseDTO> {
      return  this._httpClient.post<AuthResponseDTO>(this._configService.backendUrl + "/authentication/internal-login", authRequestDto).pipe(
        tap((data: AuthResponseDTO) => {
          this._tokenStorageService.setToken(data.token);
          this._roleService.setRoles(data.userAccount);
        })
      );
  }


  public logout(): void{
    this._tokenStorageService.deleteToken(); this._roleService.deleteRoles();
  }
  
  
  public isLoged(): boolean{
    const token: Token | null = this._tokenStorageService.getToken();
    return ! (token == null || token.expireAt < new Date(Date.now()));
  };
}

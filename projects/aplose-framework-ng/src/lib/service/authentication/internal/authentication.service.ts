import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';
import { ConfigService } from '../../config.service';
import { RoleService } from './role.service';
import { TokenStorageService } from './token-storage.service';
import { AuthRequestDTO } from '../../../dto/AuthRequestDTO';
import { AuthResponseDTO } from '../../../dto/AuthResponseDTO';
import { UserAccount } from '../../../model/UserAccount';
import { aploseDatabase } from '../../../config/indexedDB/AploseDatabase';
import { Token } from '../../../model/Token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private readonly keyName: string = 'userAccount';

  constructor(
    private _httpClient: HttpClient,
    private _configService: ConfigService,
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService
  ) {}

  public async saveLogedUserAccount(userAccount: UserAccount): Promise<void> {
    await aploseDatabase.authentication.put({
      key: this.keyName,
      value: userAccount
    });
  }

  public login$(authRequestDto: AuthRequestDTO): Observable<AuthResponseDTO | null> {
    return this._httpClient.post<AuthResponseDTO>(
      `${this._configService.backendUrl}/authentication/internal-login`,
      authRequestDto,
      { observe: 'response' }
    ).pipe(
      map((response: HttpResponse<AuthResponseDTO>) => {
        if (response.status === 200 && response.body) {
          this._tokenStorageService.setToken(response.body.token);
          this._roleService.setRoles(response.body.userAccount);
          this.saveLogedUserAccount(response.body.userAccount);
          this.isLoged$();
          return response.body;
        }
        return null;
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status !== 401) {
          throw error;
        }
        return of(null);
      })
    );
  }

  public logout(): void {
    this._tokenStorageService.deleteToken();
    this.deleteLogedUserAccount();
    this._roleService.deleteRoles();
    this.isLoged$();
  }

  public isLoged$(): Observable<boolean> {
    return this._tokenStorageService.getToken().pipe(
      map((token: Token | null) => token && token.expireAt > Date.now() ? true : false)
    );
  }

  private deleteLogedUserAccount(): void {
    aploseDatabase.authentication.delete(this.keyName);
  }
}

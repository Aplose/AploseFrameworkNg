import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, BehaviorSubject, firstValueFrom } from 'rxjs';
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
  private isLoggedSubject = new BehaviorSubject<boolean>(false);
  public isLogged$ = this.isLoggedSubject.asObservable();

  constructor(
    private _httpClient: HttpClient,
    private _configService: ConfigService,
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService
  ) {
    this.checkLoginState();
  }

  private async checkLoginState() {
    const token = await firstValueFrom(this._tokenStorageService.getToken());
    this.isLoggedSubject.next(!!token?.expireAt && token.expireAt > Date.now());
  }

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
          this.isLoggedSubject.next(true);
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
    this.isLoggedSubject.next(false);
  }

  private deleteLogedUserAccount(): void {
    aploseDatabase.authentication.delete(this.keyName);
  }
}

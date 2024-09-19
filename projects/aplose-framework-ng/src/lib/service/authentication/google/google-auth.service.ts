import { HttpClient } from '@angular/common/http';
import { Injectable, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { AuthenticationService } from '../internal/authentication.service';
import { RoleService } from '../internal/role.service';
import { TokenStorageService } from '../internal/token-storage.service';
import { AuthResponseDTO } from '../../../dto/AuthResponseDTO';
import { UserAccount } from '../../../model/UserAccount';
import { GoogleAuthResultDto } from '../../../dto/google/GoogleAuthResultDto';
import { GoogleButtonOptions } from '../../../model/google/GoogleButtonOptions';
import { ConfigService } from '../../config.service';


declare var google: any;

@Injectable({
  providedIn: 'root',
})


export class GoogleAuthService implements OnInit{

  // private publicClientId!: string;
  private gsiInitialized: boolean = false;
  private logingSubject: Subject<UserAccount> = new Subject<UserAccount>();
  private loging$: Observable<UserAccount> = this.logingSubject.asObservable();
  private registeringSubject: Subject<GoogleAuthResultDto> = new Subject<GoogleAuthResultDto>();
  private registering$: Observable<GoogleAuthResultDto> = this.registeringSubject.asObservable();


  constructor(
    private _httpClient: HttpClient, 
    private _configService: ConfigService,
    private _authenticationService: AuthenticationService,
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService,
  ) {}


  public ngOnInit(){}


  private loadGsiScript(mode: 'login' | 'register'): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      if (this.gsiInitialized) {
        resolve();
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = () => {
        google.accounts.id.initialize({
          client_id: this._configService.googlePublicClientId,
          callback: (response: any) => {
            switch(mode){
              case 'login':
                this.loginCallback(response);
                break;
              case 'register':
                this.getRegisterClaimsFromGoogleCallback(response);
                break;
              default:
                this.loginCallback(response);
                break;
            }
          },
          use_fedcm_for_prompt: true
        });
        this.gsiInitialized = true;
        resolve();
      };
      script.onerror = (error: string | Event) => {
        reject(error);
      };
      document.head.appendChild(script);
    });
  }



  public googleLogin$(target: HTMLElement, options: GoogleButtonOptions): Observable<UserAccount>{
    this.loadGsiScript('login').then(() => {
      google.accounts.id.renderButton(target, options)
    })
    return this.loging$;
  }



  private loginCallback(response: any): void{
    this._httpClient.post<AuthResponseDTO>(`${this._configService.backendUrl}/authentication/google-login`, response.credential).pipe(
      tap(
        (response: AuthResponseDTO) => {
        this._tokenStorageService.setToken(response.token);
        this._roleService.setRoles(response.userAccount);
        this._authenticationService.saveLogedUserAccount(response.userAccount);
        this.logingSubject.next(response.userAccount);
      })
      ).subscribe();
  }



  public getRegisterClaimsFromGoogle$(target: HTMLElement, options: GoogleButtonOptions): Observable<GoogleAuthResultDto>{
    this.loadGsiScript('register').then(() => {
      google.accounts.id.renderButton(target, options);
    })
    return this.registering$;
  }



  private getRegisterClaimsFromGoogleCallback(response: any): void{
    this._httpClient.post<GoogleAuthResultDto>(`${this._configService.backendUrl}/google-extract-claims`, response.credential).pipe(
      tap((claims: GoogleAuthResultDto) => {
        this.registeringSubject.next(claims);
      })
    ).subscribe();
  }
}




/**
 *  1) (front) envoyer le token google au back
 * 
 *  2) (back) extraire un UserAccount et le retourner au front
 * 
 *  3) (front) voir quelles informations il manque et afficher les inputs en consequent
 * 
 *  4) (front) quand l'utilisateur valide le form, envoi du form au back avec les infos de Google + les infos du form
 * 
 *  5) (back) enregistrement standard du compte (sans la validation du mail)
 */





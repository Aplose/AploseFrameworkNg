import { Injectable, OnInit } from '@angular/core';
import { AuthRequestDTO } from '../../../dto/AuthRequestDTO';
import { AuthResponseDTO } from '../../../dto/AuthResponseDTO';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { catchError, map, Observable, of, Subject, tap, throwError } from 'rxjs';
import { RoleService } from './role.service';
import { TokenStorageService } from './token-storage.service';
import { Token } from '../../../model/Token';
import { UserAccount } from '../../../model/UserAccount';
import { ConfigService } from '../../config.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService implements OnInit{

  private readonly storeName: string = 'authentication';
  private readonly keyName: string = 'userAccount';

  private isLogedSubject: Subject<boolean> = new Subject<boolean>();


  constructor(
    private _httpClient: HttpClient, 
    private _configService: ConfigService, 
    private _roleService: RoleService,
    private _tokenStorageService: TokenStorageService,
    private _indexedDBService: NgxIndexedDBService
  ){}

  ngOnInit(): void {

  }

  public login$(authRequestDto: AuthRequestDTO): Observable<AuthResponseDTO | null> {
      return  this._httpClient.post<AuthResponseDTO>(
        this._configService.backendUrl + "/authentication/internal-login", 
        authRequestDto, 
        { observe: 'response' }
      ).pipe(
        map((response: HttpResponse<AuthResponseDTO>) => {
          if(response.status === 200){
            this._tokenStorageService.setToken(response.body?.token!);
            this._roleService.setRoles(response.body?.userAccount!);
            this.saveLogedUserAccount(response.body?.userAccount!)
            this.isLoged$();
            return response.body;
          }
          return null;
        }),
        catchError((error: HttpErrorResponse) => {
          if(error.status !== 401){
            throw error;
          }
          return of(null);
        })
      );
  }


  public logout(): void{
    this._tokenStorageService.deleteToken(); 
    this.deleteLogedUserAccount();
    this._roleService.deleteRoles();
    this.isLoged$();
  }
    
  public isLoged$(): Observable<boolean>{
    this._tokenStorageService.getToken().pipe(
      map((token: Token | null) => token && token.expireAt > Date.now() ? true : false)
    ).subscribe((isLoged: boolean) => {
      this.isLogedSubject.next(isLoged);
      if( ! isLoged){
        this._tokenStorageService.deleteToken(); 
        this.deleteLogedUserAccount();
        this._roleService.deleteRoles();
      }
    })
    return this.isLogedSubject.asObservable();
  };

  public saveLogedUserAccount(userAccount: UserAccount): void{
    this._indexedDBService.selectDb('aploseFrameworkNg')
    this._indexedDBService.add(this.storeName, { key: this.keyName, value: userAccount}).subscribe();
  }

  public getLogedUserAccount$(): Observable<UserAccount | null>{
    this._indexedDBService.selectDb('aploseFrameworkNg')
    return this._indexedDBService.getByKey<{key: String, value: UserAccount} | undefined>(this.storeName, this.keyName).pipe(
      map((store: any) => store ? store.value : null)
    );
  }

  private deleteLogedUserAccount(): void{
    this._indexedDBService.selectDb('aploseFrameworkNg')
    this._indexedDBService.delete(this.storeName, this.keyName).subscribe();
  }
}

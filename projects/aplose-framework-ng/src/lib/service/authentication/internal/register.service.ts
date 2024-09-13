import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { RegisterDto } from '../../../dto/RegisterDto';
import { Observable } from 'rxjs';
import { UserAccount } from '../../../model/UserAccount';
import { GoogleAuthResultDto } from '../../../dto/google/GoogleAuthResultDto';
import { ConfigService } from '../../config.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  // INTERNAL
  public register$ = (body: RegisterDto): Observable<UserAccount> => 
    this._httpClient.post<UserAccount>(`${this._configService.backendUrl}/register`, body);

  public activateUserAccount$ = (activationCode: string): Observable<string> => 
    this._httpClient.patch<string>(`${this._configService.backendUrl}/account-activation/${activationCode}`, {});


  // GOOGLE
  public googleRegister$ = (body: RegisterDto): Observable<UserAccount> => 
    this._httpClient.post<UserAccount>(`${this._configService.backendUrl}/google-register`, body);

  public extractGoogleClaims$ = (body: String): Observable<GoogleAuthResultDto> => 
    this._httpClient.post<GoogleAuthResultDto>(`${this._configService.backendUrl}/google-extract-claims`, body);

}

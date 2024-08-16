import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { RegisterDto } from '../../dto/RegisterDto';
import { Observable } from 'rxjs';
import { UserAccount } from '../../model/UserAccount';
import { Browser } from '@capacitor/browser';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public register$ = (body: RegisterDto): Observable<UserAccount> => 
    this._httpClient.post<UserAccount>(`${this._configService.backendUrl}/register`, body);

  public activateUserAccount$ = (activationCode: string): Observable<string> => 
    this._httpClient.patch<string>(`${this._configService.backendUrl}/accountActivation/${activationCode}`, {});
}

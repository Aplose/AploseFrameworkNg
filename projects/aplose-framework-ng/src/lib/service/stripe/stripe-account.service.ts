import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config/config.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StripeAccountService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public sendAccountLink$ = (): Observable<string> => {
    return this._httpClient.get<string>(`${this._configService.backendUrl}/stripe/account-link`);
  }
}

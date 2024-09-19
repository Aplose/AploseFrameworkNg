import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class StripeAccountService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public sendAccountLink$ = (): Observable<string> => {
    return this._httpClient.get(`${this._configService.backendUrl}/stripe/account-link`, {responseType: 'text'});
  }
}

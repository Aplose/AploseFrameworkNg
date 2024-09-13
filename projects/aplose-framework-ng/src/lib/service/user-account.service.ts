import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Page } from '../model/Page';
import { Person } from '../model/Person';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class UserAccountService {



  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public searchProfessional$(
    query: string,
    countryCode: string,
    sort: string | undefined = undefined, 
    direction: string | undefined = undefined, 
    page: number | undefined = undefined, 
    size: number | undefined = undefined
  ): Observable<Page<Person[]>>
  {
    return this._httpClient.get<Page<Person[]>>(`${this._configService.backendUrl}/professional/search/${query}?` +
      `countryCode=${countryCode ? countryCode : 'FR'}` +
      `&sort=${encodeURIComponent(sort ? sort : '')}` +
      `&direction=${direction ? direction : ''}` +
      `&page=${page ? page : ''}` +
      `&size=${size ? size : ''}`
    );
  }

}

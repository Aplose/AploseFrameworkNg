import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { Service } from '../model/Service';
import { ConfigService } from '../config/config.service';
import { Page } from '../model/Page';
import { ServiceDto } from '../dto/ServiceDto';

@Injectable({
  providedIn: 'root'
})
export class ServiceService {



  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }



  public createService$(service: ServiceDto){
    return this._httpClient.post<Service>(`${this._configService.backendUrl}/service`, service);
  }


  public loadServiceById$(serviceId: number): Observable<Service>{
    return this._httpClient.get<Service>(`${this._configService.backendUrl}/service/${serviceId}`);
  }



  public loadServices$(
    countryCode: string,
    sort: string | undefined | null = undefined, 
    direction: string | undefined | null = undefined, 
    page: number | undefined | null = undefined, 
    size: number | undefined | null = undefined
  ): Observable<Page<Service[]>>
  {    
    return this._httpClient.get<Page<Service[]>>(
      `${this._configService.backendUrl}/services?` +
      `&countryCode=${countryCode ? countryCode : 'FR'}` +
      `&sort=${encodeURIComponent(sort ? sort : '')}` +
      `&direction=${direction ? direction : ''}` +
      `&page=${page ? page : ''}` +
      `&size=${size ? size : ''}`
    );
  }


  
  public searchService$(
    query: string,
    countryCode: string,
    minDuration: number,
    maxDuration: number,
    sort: string | undefined = undefined, 
    direction: string | undefined = undefined, 
    page: number | undefined = undefined, 
    size: number | undefined = undefined
  ): Observable<Page<Service[]>>
  {    
    return this._httpClient.get<Page<Service[]>>(
      `${this._configService.backendUrl}/service/search/${query}?` +
      `&countryCode=${countryCode ? countryCode : 'FR'}` +
      `&minDuration=${minDuration ? minDuration : ''}` +
      `&maxDuration=${maxDuration ? maxDuration : ''}` +
      `&sort=${encodeURIComponent(sort ? sort : '')}` +
      `&direction=${direction ? direction : ''}` +
      `&page=${page ? page : ''}` +
      `&size=${size ? size : ''}`
    );
  }
}

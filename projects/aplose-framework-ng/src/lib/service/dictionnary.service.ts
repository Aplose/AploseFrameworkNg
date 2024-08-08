import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Civility } from '../model/Civility';
import { ConfigService } from '../config/config.service';
import { Country } from '../model/Country';
import { AppointmentType } from '../model/AppointmentType';

@Injectable({
  providedIn: 'root'
})
export class DictionnaryService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public loadCivilities$(): Observable<Civility[]>{
    return this._httpClient.get<Civility[]>(`${this._configService.backendUrl}/dictionnary/civilities`);
  }


  public loadCountries$(): Observable<Country[]>{
    return this._httpClient.get<Country[]>(`${this._configService.backendUrl}/dictionnary/countries`);
  }


  public loadAppointmentTypes$(): Observable<AppointmentType[]>{
    return this._httpClient.get<AppointmentType[]>(`${this._configService.backendUrl}/dictionnary/appointment/types`);
  }
}

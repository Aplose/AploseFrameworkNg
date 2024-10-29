import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';
import { TranslationDto } from '../dto/TranslationDto';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private defaultLocale:string = 'fr-FR';
  private userDefaultLanguage!:string;

  constructor(private idbService:NgxIndexedDBService, private httpClient:HttpClient, private configService:ConfigService) {
    if(window.navigator){
      this.userDefaultLanguage = window.navigator.language;
    }else{
      this.userDefaultLanguage = this.defaultLocale;
    }
  }

  async getTranslation(key:string,defaultValue:string):Promise<string>{
    this.idbService.selectDb('AploseFrameworkNg')
    let value: TranslationDto = await firstValueFrom(this.idbService.getByKey('translation', key));
    if(!value){
      value = await firstValueFrom(this.httpClient.get<TranslationDto>(this.configService.backendUrl + '/translation?code=' + key+'&defaultMessage='+defaultValue));
      this.idbService.add('translation', value).subscribe();
    }
    return value.message;
  }

}

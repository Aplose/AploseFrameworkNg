import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';

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
    //d'abord on regarde en local
    let value:string = await firstValueFrom(this.idbService.getByID<string>('translation',key),{ defaultValue: '' });
    //puis on regarde à distance en envoyant la locale et la valeur par défaut au cas ou
    if(value===''){
      value= await firstValueFrom(this.httpClient.get<string>(this.configService.backendUrl + '/translation?code=' + key + '&defaultMessage=' + defaultValue)); //     value = await 
      //on ajoute la traduction en local
      this.idbService.add('translation',{ key: key, value: value });
    }
    return value;
  }

}

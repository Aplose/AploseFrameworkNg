import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private defaultLocale:string = 'fr-FR';
  private userDefaultLanguage!:string;

  constructor(private idbService:NgxIndexedDBService, private httpClient:HttpClient) {
    if(window.navigator){
      this.userDefaultLanguage = window.navigator.language;
    }else{
      this.userDefaultLanguage = this.defaultLocale;
    }
  }

  async getT(key:string,defaultValue:string):Promise<string>{
    //d'abord on regarde en local
    let value:string = await firstValueFrom(this.idbService.getByID<string>('translation',key),{ defaultValue: '' });
    //puis on regarde à distance en envoyant la locale et la valeur par défaut au cas ou
    if(value===''){
//      this.httpClient.get<string>(environment.)
 //     value = await 
    }
    
    //si rien on essaye juste avec la langue

    //si rien on garde la valeur par défaut...
    return value;
  }

}

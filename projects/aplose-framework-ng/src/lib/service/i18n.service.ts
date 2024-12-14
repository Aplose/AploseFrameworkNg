import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';
import { TranslationDto } from '../dto/TranslationDto';
import { aploseDatabase } from '../config/indexedDB/AploseDatabase';

@Injectable({
  providedIn: 'root'
})
export class I18nService {
  private defaultLocale: string = 'fr-FR';
  private userDefaultLanguage!: string;

  constructor(
    private httpClient: HttpClient,
    private configService: ConfigService
  ) {
    this.userDefaultLanguage = window.navigator?.language || this.defaultLocale;
  }

  async getTranslation(key: string, defaultValue: string): Promise<string> {
    const value = await aploseDatabase.translation.get(key);
    
    if (!value) {
      const translation = await firstValueFrom(
        this.httpClient.get<TranslationDto>(
          `${this.configService.backendUrl}/translation?code=${key}&defaultMessage=${defaultValue}`
        )
      );
      
      await aploseDatabase.translation.put({
        code: key,
        locale: this.userDefaultLanguage,
        message: translation.message
      });
      
      return translation.message;
    }
    
    return value.message;
  }
}

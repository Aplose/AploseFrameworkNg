import { Injectable, InjectionToken, Inject } from '@angular/core';
import { Config } from '../model/Config';

export const APLOSE_FRAMEWORK_NG_CONFIG = new InjectionToken<Config>('aplose-framework-ng-config');

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  constructor(@Inject(APLOSE_FRAMEWORK_NG_CONFIG) private config: Config) { }

  public get backendUrl(): string {
    return this.config.backendUrl;
  }

  public get googlePublicClientId(): string{
    return this.config.googlePublicClientId;
  }
}

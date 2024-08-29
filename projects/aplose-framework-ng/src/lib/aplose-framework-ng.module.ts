import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Config } from './model/Config';
import { APLOSE_FRAMEWORK_NG_CONFIG } from './config/config.service';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { NgxStripeModule } from 'ngx-stripe';
import { aploseDBConfig } from './config/indexedDB/indexedDBConfig';



@NgModule({ 
  declarations: [

  ], 
  imports: [
    NgxIndexedDBModule.forRoot(aploseDBConfig),
    NgxStripeModule
  ], 
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  exports: []
})

export class AploseFrameworkNgModule {
  static forRoot(config: Config): ModuleWithProviders<AploseFrameworkNgModule> {
    return {
      ngModule: AploseFrameworkNgModule,
      providers: [
        { provide: APLOSE_FRAMEWORK_NG_CONFIG, useValue: config }
      ]
    };
  }
}

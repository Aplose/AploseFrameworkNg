import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Config } from './model/Config';
import { NgxStripeModule } from 'ngx-stripe';
import { APLOSE_FRAMEWORK_NG_CONFIG } from './service/config.service';
import { I18nPipe } from './pipe/i18n.pipe';



@NgModule({ 
  declarations: [
  ], 
  imports: [
    NgxStripeModule,I18nPipe
  ], 
  providers: [
    provideHttpClient(withInterceptorsFromDi())
  ],
  exports: [I18nPipe]
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

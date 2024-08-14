import { ModuleWithProviders, NgModule } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { Config } from './model/Config';
import { APLOSE_FRAMEWORK_NG_CONFIG } from './config/config.service';



@NgModule({ declarations: [], imports: [], providers: [provideHttpClient(withInterceptorsFromDi())] })

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

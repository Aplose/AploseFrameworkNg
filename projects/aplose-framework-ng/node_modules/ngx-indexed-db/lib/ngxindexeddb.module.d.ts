import { ModuleWithProviders } from '@angular/core';
import { DBConfig } from './ngx-indexed-db.meta';
import * as i0 from "@angular/core";
import * as i1 from "@angular/common";
export declare class NgxIndexedDBModule {
    static forRoot(...dbConfigs: DBConfig[]): ModuleWithProviders<NgxIndexedDBModule>;
    static ɵfac: i0.ɵɵFactoryDeclaration<NgxIndexedDBModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<NgxIndexedDBModule, never, [typeof i1.CommonModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<NgxIndexedDBModule>;
}

/*
 * Public API Surface of aplose-framework-ng
 */





// MODULE
export { AploseFrameworkNgModule } from './lib/aplose-framework-ng.module';

//PIPE
export { I18nPipe } from './lib/pipe/i18n.pipe';

//SERVICE
export { AuthGuardService } from './lib/guard/auth-guard.service';
export { RoleGuardService } from './lib/guard/role-guard.service';
export { AuthenticationService } from './lib/service/authentication/internal/authentication.service';
export { RoleService } from './lib/service/authentication/internal/role.service';
export { DictionnaryService } from './lib/service/dictionnary.service';
export { RegisterService } from './lib/service/authentication/internal/register.service';
export { HttpInterceptorService } from './lib/service/http/http-interceptor.service';
export { StripeAccountService } from './lib/service/stripe/stripe-account.service';
export { UserAccountService } from './lib/service/user-account.service';
export { ServiceService } from './lib/service/service.service';
export { GoogleAuthService } from './lib/service/authentication/google/google-auth.service';
export { ProposalService } from './lib/service/dolibarr/proposal.service';
export { I18nService } from './lib/service/i18n.service';
export { ProductService } from './lib/service/dolibarr/product.service';


// COMPONENT
export { PaymentComponent } from './lib/component/payment/payment.component';
export { RegisterComponent } from './lib/component/register/register.component';
export { LoginComponent } from './lib/component/login/login.component';
export { ProposalValidationComponent } from './lib/component/proposal-validation/proposal-validation.component';
export { ProposalsComponent } from './lib/component/proposals/proposals.component';
export { VizuLiveComponent } from './lib/component/vizu-live/vizu-live.component';

// MODEL
export { AppointmentType } from './lib/model/AppointmentType';
export { Civility } from './lib/model/Civility';
export { Cloneable } from './lib/model/Cloneable';
export { Country } from './lib/model/Country';
export { GrantedAuthority } from './lib/model/GrantedAuthority';
export { Locale } from './lib/model/Locale';
export { Permission } from './lib/model/Permission';
export { Role } from './lib/model/Role';
export { Serializable } from './lib/model/Serializable';
export { Token } from './lib/model/Token';
export { UserAccount } from './lib/model/UserAccount';
export { UserDetails } from './lib/model/UserDetails';
export { Page } from './lib/model/Page';
export { Service } from './lib/model/Service';
export { Person } from './lib/model/Person';
export { Address } from './lib/model/Address';
export { GoogleButtonOptions } from './lib/model/google/GoogleButtonOptions';
export { PaymentIntentResult, PaymentMethodResult } from '@stripe/stripe-js';
export { DolibarrObject } from './lib/model/dolibarr/DolibarrObject';
export { Proposal } from './lib/model/dolibarr/Proposal';
export { ProposalLine } from './lib/model/dolibarr/ProposalLine';
export { Category } from './lib/model/dolibarr/Category';
export { CategoryFlat } from './lib/model/dolibarr/CategoryFlat';
export { DocumentFile } from './lib/model/dolibarr/DocumentFile';
export { DolibarrDocument } from './lib/model/dolibarr/DolibarrDocument';
export { Product } from './lib/model/dolibarr/Product';



// DTO
export { AuthRequestDTO } from './lib/dto/AuthRequestDTO';
export { AuthResponseDTO } from './lib/dto/AuthResponseDTO';
export { RegisterDto } from './lib/dto/RegisterDto';
export { ServiceDto } from './lib/dto/ServiceDto';
export { GoogleAuthResultDto} from './lib/dto/google/GoogleAuthResultDto';
export { ProposalLineDTO } from './lib/dto/dolibarr/ProposalLineDTO';



// ENUM
export { RoleEnum } from './lib/enum/RoleEnum';
export { AuthenticationTypeEnum } from './lib/enum/AuthenticationTypeEnum';
export { RegisterTypeEnum } from './lib/enum/RegisterTypeEnum';
export { ProposalProductTypeEnum } from './lib/enum/ProposalProductTypeEnum';



// CONFIG
export { aploseDatabase } from './lib/config/indexedDB/AploseDatabase';


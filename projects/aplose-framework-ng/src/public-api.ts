/*
 * Public API Surface of aplose-framework-ng
 */





// MODULE
export { AploseFrameworkNgModule } from './lib/aplose-framework-ng.module';



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


// COMPONENT
export { PaymentComponent } from './lib/component/payment/payment.component';


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



export { aploseDBConfig } from './lib/config/indexedDB/indexedDBConfig';
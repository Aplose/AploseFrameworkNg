# AploseFrameworkNg

Angular frontend part of AploseFramework

## <u>QuickStart</u>

### Compiler le package

- A la racine d'aploseframeworkng, executer `ng build aplose-framework-ng`;

- naviguer vers `./dist/aplose-framework-ng`;

- pour un package en local:
  
  executer `npm pack`, un fichier
  
  `aplose-framework-ng-0.0.1.tgz` est créer dans le repertoire courant;

- pour publier le package:
  
  executer `npm publish` (attention à incrémenter la sous-version du package à chaques publish. Incrementer la sous-version dans `aploseframeworkng/projects/aplose-framework-ng/package.json` )

### <mark> Installer le package</mark>

#### en local:

- installer le package dans votre application avec `npm install ./chemin/vers/le/package/aplose-framework-ng-0.0.1.tgz`

#### par NPM:

- installer le package via `npm install aplose-framework-ng`

### <mark> Configurer le package</mark>

#### 1 Créer les variables d'environnement

- Dans votre application Angular, créer trois variables d'environnement:
1. une variable qui contient l'`url de votre back-end` (back-end integrant `aploseframework`).

2. une variable qui contient votre `id public de client OAuth2.0 Google Cloud` que vous trouverez dans la `Console Google Cloud`.
   Si vous ne possédez pas cette id vous devrez le créer.
   
   voir: [console Google](#https://console.cloud.google.com/apis/credentials)

3. une variable qui contient votre `clé publique Stripe` (vous devez avoir un compte `Stripe Connect`), vous pouvez trouver votre clé sur votre `dashboard` sur le site officiel Stripe
   
   voir: [dashboard Stripe](#[Connexion Stripe | Se connecter au Dashboard Stripe](https://dashboard.stripe.com/apikeys))

    





   <u>Exemple</u>

   Dans `environement.ts`:

```typescript
export const environment = {
  // autres variables de votre application...
  backendUrl: "http://localhost:8087/api",
  googlePublicClientId: "votre_id_client_OAuth2.apps.googleusercontent.com"
};
```

- Dans votre application Angular, dans `app.module.ts`, importer `AploseFrameworkNgModule`
  
  ```typescript
  import { AploseFrameworkNgModule } from 'aplose-framework-ng';
  ```
  
  et appeler la méthode `AploseFrameworkNgModule.forRoot(config: Config)` en lui donnant comme arguments un objet de type
  
  ```typescript
  {backendUrl: string, googlePublicClientId: string}
  ```
  
  contenant vos deux variables d'environnement `environment.backendUrl` et `environment.googlePublicClientId`.

### 2 Importer NgxIndexedDBModule

- Afin que le package aplose-framework-ng puisse utiliser `IndexedDB` et fonctionner correctement, vous devrez également importer `aploseDBConfig: DBConfig` depuis `aplose-framework-ng` et importer `NgxIndexedDBModule` dans `app.module.ts` en appelant la méthode `forRoot()` et en lui donnant comme argument le `aploseDBConfig: DBConfig` 
  
  app.module.ts:
  
  ```typescript
  NgxIndexedDBModule.forRoot(aploseDBConfig)
  ```

- Si vous souhaitez utiliser votre propre IndexedDB dans votre application, créer le fichier de configuration de la IndexedDB de type `ngx-indexed-db.DBConfig`
  
  exemple de configuration :
  
  ```typescript
  import { DBConfig } from "ngx-indexed-db";
  
  
  export const appliDBConfig: DBConfig = {
       name: 'applicationDB',
       version: 1,
       objectStoresMeta: [
          {
              store: 'user',
              storeConfig: { keyPath: 'id', autoIncrement: true },
              storeSchema: [
                  { name: 'id', keypath: 'id', options: { unique: true } },
                  { name: 'name', keypath: 'name',options: {unique: false}}
              ]
          }
      ],
   };
  ```





### 3 Fournir le HttpInterceptorSDervice

  Toujours dans `app.module.ts` il vous faut fournir l'intercepteur http fourni par aplose-framework-ng pour que les requêtes au back-end soit authorisées.

  Importer `HttpInterceptorService` depuis aplose-framework-ng et l'inclure dans `providers` comme ceci:

```typescript
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
```

   Ainsi à chaque requête `HttpInterceptorService` ajoutera le token d'authentification dans le header de chaque requêtes.

  <u>Exemple complet:</u>

  Dans `app.module.ts`:

```typescript
import { NgModule } from '@angular/core';
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { appliDBConfig } from './db/idb-config-and-schema';
import { AppComponent } from './app.component';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { aploseDBConfig, AploseFrameworkNgModule, HttpInterceptorService } from 'aplose-framework-ng';
import { environment } from 'src/environments/environment';
import { HTTP_INTERCEPTORS, provideHttpClient } from '@angular/common/http';
import { RouteReuseStrategy } from '@angular/router';
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(),
    AppRoutingModule,
    // importer le module NgxIndexedDBModule avec utilisation de 
    // deux IndexedDB (celle utilisé par aplose-framework-ng et une suplementaire 
    // optionnelle)
    NgxIndexedDBModule.forRoot(appliDBConfig, aploseDBConfig),
    // definir les variables
    AploseFrameworkNgModule.forRoot({
      backendUrl: environment.backendUrl,
      googlePublicClientId: environment.googlePublicClientId,
    })
],
  providers: [
    provideHttpClient(),
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
```







## <u>AuthenticationService</u>

Le package aplose-framework-ng implémente une solution d'authentification prête à l'emploi.


#### <u><mark>Connexion</mark></u>

Pour connecter un utilisateur, importer `AuthenticationService` et appeler la méthode `login$()` avec un `AuthRequestDto` en argument.



En retour vous aurez un `Observable<AuthResponseDto>` contenant une entité `Token` et une entité `UserAccount`  .


Le `Observable<AuthResponseDto>` que vous obtenez en retour vous permert de l'utilisé si besoin, le package aplose-framework-ng se charge de `mettre en mémoire` le token et les informations du compte `automatiquement` . 


Vous pouvez également retrouver le UserAccount ulterieurement en utilisant la méthode `AuthenticationService.getLogedUserAccount$()`, elle ne prend pas de paramètre et retourne un `Observable<UserAccount | null>` (null si l'utilisateur n'est pas connecté) 



Lors d'une connexion, les `rôles`, le `UserAccount` et le `Token` sont enregistré dans une indexedDB dédiée au package, elle est nommé `AploseFrameworkNg` et store est nommé `authentication`



Le token à un temps de validité de ... jours.



##### Exemple:

login.page.html:

```typescript
  <ion-card>
    <ion-card-content>
   
      <ion-card>
        <ion-card-content>
           <form [formGroup]="loginForm">
            <ion-input type="email" labelPlacement="floating" id="username" label="Email" formControlName="username"></ion-input>
            <ion-input type="password" labelPlacement="floating" id="password" label="Mot de passe" formControlName="password"></ion-input>
            <ion-button type="submit" id="submit" (click)="onLoginSubmit()">Se connecter</ion-button>
          </form>
        </ion-card-content>
      </ion-card>
         
      <ion-card>
        <ion-card-content>
          <div id="googleButtonContainer"></div>
        </ion-card-content>
      </ion-card>

    </ion-card-content>
  </ion-card>
```

login.page.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthenticationService, UserAccount } from 'aplose-framework-ng';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit{

  public loginForm!:FormGroup;

  constructor(
    private _authenticationService: AuthenticationService, 
    private _route: ActivatedRoute, 
    private _router: Router
  ) {}

  ngOnInit(){
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    })
  }


  public onLoginSubmit(){
    // loginForm.value correspond à l'interface AuthRequestDto
    this._authenticationService.login$(this.loginForm.value).subscribe({
        next: (response: AuthResponseDto) => {
            // vous pouvez utiliser UserAccount si besoin
            console.log('userAccount:', response.userAccount);
            this._router.navigate(['/home']);
          },
        error: (e: Error) => {console.log('Error:', e.message);}
    });
  }
}

```





#### <mark>deconnexion</mark>



Pour deconnecter l'utilisateur, il faut appeler la méthode `AuthenticationService.logout()`, le package aplose-framework-ng efface alors les rôles, le token et le UserAccount de l'utilisateur.



##### <u>exemple:</u>

logout.component.html:

```typescript
<h1>Deconnexion</h1>


<ion-button (click)="onClick()">Se deconnecter</ion-button>
```

logout.component.ts:

```typescript
import { Component } from '@angular/core';
import { AuthenticationService } from 'aplose-framework-ng';
import { Observable } from 'rxjs';



@Component({
  selector: 'app-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class AppComponent {

  constructor(private _authenticationService: AuthenticationService) { }

  public logout(){
    this._authenticationService.logout();
  }
}

```





#### <mark>Savoir si l'utilisateur est connecté</mark>



Pour savoir si l'utilisateur est connecté, le package aplose-framework-ng propose une méthode dédiée qui retourne un `Observable<boolean>`, il s'agit de la méthode `AuthenticationService.isLoged$()`







## <u>GoogleAuthService</u>

#### <mark>Prerequis:</mark>

1. Sur votre page de création de compte, vous devez prévoir un conteneur dans lequel le button ***se connecter avec Google*** sera injecté.

2. Votre application dois fournir les deux variables d'environnement `backendUrl` et `googlePublicClientId`, voir `Quickstart/Avant de commencer`

### <mark> Création de compte avec Google </mark>

Pour utiliser la création de compte avec Google, merci de vous référé au [Prerequis](#google-prerequis) de Google Identity Services

#### Utilisation:

Pour créer le boutton `se connecter avec Google`, importer `GoogleAuthService` et appeler la méthode `GoogleAuthService.getRegisterClaimsFromGoogle$(target: HTMLElement, options: GoogleButtonOptions): Observable<GoogleAuthResultDto>`

(vous pouvez l'appeler au chargement de la page pour avoir le boutton directement).

Souscrivez ( .subscribe() ) à l'`Observble<GoogleAuthResultDto>` retourné par la fonction `.getRegisterClaimsFromGoogle$()`, c'est grâce à cette souscription que vous récuperez les informations de l'utilisateur qui s'enregistre avec Google.

Lorsque l'utilisateur clique sur le boutton ***se connecter avec Google***, va jusqu'au bout du processus de Google Identity et que vous recevez le GoogleAuthResultDto en réponse, le package à déjà envoyer le token Google à votre back-end , traiter le token , extrait et renvoyé les informations de l'utilisateur à votre application front sans que vous n'ayez rien à faire (grâce à l'intégration d'aploseFramework à votre back-end).

Cependant rien n'est encore enregistré en base de donnés, de façon à ce que vous puissiez demander des informations supplementaire à votre utilisateur via un formulaire par exemple.

Vous pourrez ensuite envoyé le tout ( les informations reçus grâce à Google et les informations supplementaires) en utilisant l'`enregistrement de compte interne` avec la méthode

`RegisterService.register$(dto: RegisterDto)=>Observable<UserAccount>` .

Vous devrez alors envoyer le RegisterDto avec la propriété `authenticationType: AuthneticationTypeEnum` égale à `AuthenticationTypeEnum.GOOGLE`

<u>Exemple:</u>

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationTypeEnum, GoogleButtonOptions, Civility, Country, DictionnaryService, GoogleAuthResultDto, GoogleAuthService, RegisterService } from 'aplose-framework-ng';
import { map, Observable } from 'rxjs';

@Component({
  selector: 'app-register-google',
  templateUrl: './register-google.page.html',
  styleUrls: ['./register-google.page.scss'],
})
export class RegisterGooglePage implements OnInit {

  public googleRegisterForm!: FormGroup;
  public countries$!: Observable<Country[]>;
  public civilities$!: Observable<Civility[]>;
  public claimsButton$!: Observable<GoogleAuthResultDto>;
  public claims!: GoogleAuthResultDto;


  constructor(
    private _googleAuthService: GoogleAuthService,
    private _registerService: RegisterService,
    private _dictionnaryService: DictionnaryService,
  ) { }

  ngOnInit() {
    this.countries$ = this._dictionnaryService.loadCountries$().pipe(
      map((countries: Country[]) => countries.sort((a, b) => a.id - b.id))
    );
    this.civilities$ = this._dictionnaryService.loadCivilities$();
  }

  public ngAfterViewInit(){
    this.claimsButton$ = this._googleAuthService.getRegisterClaimsFromGoogle$(
      document.getElementById('googleButtonContainer')!, 
      {
        theme: 'outline',
        size: 'small',
        // autres configurations (voir la classe GoogleButtonOptions)
      } as GoogleButtonOptions
    );
    this.claimsButton$.subscribe((claims:  GoogleAuthResultDto) => {
      this.claims = claims;
      this.createForm(claims);
    });
  }


  private createForm(claims: GoogleAuthResultDto){
    this.googleRegisterForm = new FormGroup({
      isProfessional: new FormControl(false),
      phone: new FormControl('', () => claims.phone ? null : Validators.required),
      civilityRowid: new FormControl('', Validators.required),
      addressCountryCode: new FormControl('', () => claims.locale ? null : Validators.required),
      userAccountCompanyName: new FormControl({value: '', disabled: true}, Validators.required),
    })
    this.googleRegisterForm.get('isProfessional')!.valueChanges.subscribe((isProfessional: boolean) => {
      isProfessional ? this.googleRegisterForm.get('userAccountCompanyName')!.enable() : this.googleRegisterForm.get('userAccountCompanyName')!.disable();
    })
  }


  public onGoogleRegisterFormSubmit(e: Event){
    const dto = {
      userAccountUsername: this.claims.email,
      userAccountPassword: this.claims.uniqueId,
      passwordRepeat: this.claims.uniqueId,
      isProfessional: this.googleRegisterForm.get('isProfessional')?.value,
      firstName: this.claims.firstname,
      lastName: this.claims.lastname,
      phone: this.claims.phone != null ? this.claims.phone : this.googleRegisterForm.get('phone')?.value,
      civilityRowid: this.googleRegisterForm.get('civilityRowid')?.value,
      addressCountryCode: this.claims.locale ? this.claims.locale : this.googleRegisterForm.get('addressCountryCode')?.value,
      userAccountCompanyName: this.googleRegisterForm.get('isProfessional')?.value ? this.googleRegisterForm.get('userAccountCompanyName')?.value : null,
      authenticationType: AuthenticationTypeEnum.GOOGLE 
    }
    this._registerService.register$(dto).subscribe(()=>{console.log('Registration successfull !!!');
    })
  }
}
```

#### Workflow:

1. (front) envoyer le token google au back

2. (back) extraire un UserAccount et le retourner au front

3. (front) voir quelles informations il manque et afficher les inputs en consequent

4. (front) quand l'utilisateur valide le form, envoi du form au back avec les infos de Google + les infos du form

5. (back) enregistrement standard du compte (sans la validation du mail)

### <mark>Connexion avec Google</mark>

Pour utiliser le login Google réfféré vous au [Prerequis](#google-prerequis)

#### Utilisation:

Pour la connexion avec Google vous devez créer le boutton `se connecter avec Google`.

Pour créer le boutton `se connecter avec Google`, importer `GoogleAuthService` et appeler la méthode `GoogleAuthService.googleLogin$(target: HTMLElement, options: GoogleButtonOptions): Observable<UserAccount>`

(vous pouvez l'appeler au chargement de la page pour avoir le boutton directement).

Souscrivez à l'observable retourné par `googleLogin$()` pour récupérer un `UserAccount`, le package `aplose-framework-ng` se charge d'envoyé les informations au back-end (back-end qui integre `aplose-framework`) et de récupérer et gérer le token d'identification et les informations de l'utilisateur.

Une fois les `informations` ainsi que le `token` et les `rôles` eventuels de l'utilisateur sont renvoyés du back-end, il sont enregistrés automatiquement dans `IndexedDB` dans le store `authentication`.

En somme, vous n'avez juste à appeler `GoogleAuthService.googleLogin$()` et à souscrire à l'Observable retourné pour que votre utilisateur soit connecté.

#### <u>Exemple:</u>

login.page.html:

```html
<ion-header [translucent]="true">
  <ion-toolbar>
    <ion-title>login</ion-title>
  </ion-toolbar>
</ion-header>

<ion-content [fullscreen]="true">

  <h1>Connexion</h1>

  <div id="googleLoginButtonContainer">
    <!-- boutton 'se connecter avec Google' injecté ici -->
  </div>

</ion-content>
```

login.page.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { GoogleAuthService, UserAccount } from 'aplose-framework-ng';
import { GoogleButtonOptions } from 'aplose-framework-ng/lib/model/google/GoogleButtonOptions';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private _googleAuthService: GoogleAuthService) { }

  ngOnInit() {
    this._googleAuthService.googleLogin$(document.getElementById('googleLoginButtonContainer')!, {
      // utiliser les propriétés de GoogleButtonOptions pour personnalisé le bouton Google
      theme: 'outline',
      size: 'medium'
    } as GoogleButtonOptions).subscribe({
      next: (userAccount: UserAccount) => {
        console.log(`UserAccount ${userAccount.username} is loged.`);
      },
      error: (e: Error) => {
        console.log(`Error: ${e.message}`);
      }
    })
  }
}
```

<u>ps:</u> Utiliser les propriétés de GoogleButtonOptions pour `personnaliser le boutton Google`.

voir: [doc Google](https://developers.google.com/identity/gsi/web/reference/js-reference?hl=fr#GsiButtonConfiguration)

#### Workflow:

1. (front) envoie du token Google au back-end

2. (back) vérification et génération d'un JWT si l'utilisateur existe sinon une `VerificationException` est levée

3. (back) réponse et renvoie d'un `AuthResponseDto` contenant un `Json Web Token` de type AuthenticationTypeEnum.GOOGLE ainsi que le `UserAccount` concerné

4. (front) enregistrement dans `IndexedDB` du `Token`, des `rôles` de l'utilisateur et de l'entité `UserAccount`

## <u>STRIPE</u>

Aplose-framework-ng propose un service permettant de créer des comptes connectés Stripe Connect pour les perstataires de services afin qu'il puissent proposer leurs services sur votre application. 

Il permet également à des particuliers de payer ces services par carte bancaire.
Lorsqu'un particulier achète un service sur l'application, le payment est directement envoyé au prestataire.
Des frais sont prélevés par Stripe et par votre application à chaque transactions.

##### Prerequis:

Pour utiliser la fonctionalité de payement d'un service, vous devez definir une variable d'environnement `stripePublicKey` avec votre clé public que vous pouvez obtenir sur le `dashboard` de votre `compte Stripe Connect`.

voir: [Connexion Stripe | Se connecter au Dashboard Stripe](https://dashboard.stripe.com/dashboard)

<u>exemple:</u>

```typescript
export const environment = {
  production: false,
  backendUrl:"http://localhost:8087/api",
  wpPostUrl:"https://www.serenitydate.eu/wp-json/wp/v2/posts?categories=3",
  stripePublicKey:"pk_test_51PgTKSRv1emW5nG2C1iE3IbuHB5NTGzlktUtDe53w96vCcWzqCQimj4Eh1pQ8MzmDKJbfutwvVm6iE2OxZvWWFDN00jllKaJft",
  googlePublicClientId:""
};
```

#### <mark>Création d'un compte pour un prestataire</mark>

Lorsqu'un utilisateur s'enregistre sur votre application avec le package aplose-framework-ng, s'il à selectionné la case `isProfessionnal` dans le formulaire d'enregistrement de compte, un mail lui ais `automatiquement envoyé` après la saisie correcte de son code de validation de compte contenant un lien vers lequel il pourra renseigner les informations demandés par Stripe.

Ce lien n'est utilisable qu'une seule fois et pour cette raison vous devez fournir un bouton permettant à l'utilisateur de `rafraichir le lien` afin de finaliser son inscription.

Pour rafraichir le lien (l'utilisateur dois être connecté) il suffit d'appeler la méthode `StripeAccountService.sendAccountLink$()` de type `()=>Observable<string>` et de souscrire à l'Observable retourné, un mail sera alors renvoyé à l'utilisateur connecté avec un nouveau lien.

##### exemple:

refresh-account-link.page.html:

```html
<h1>Rafraichir le lien Stripe pour un prestataire</h1>


<button (click)="onClick()">rafraichir</button>
```

refresh-account-link.page.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { StripeAccountService } from 'aplose-framework-ng';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class RefreshAccountLinkPage {

  constructor(private _stripeAccountService: StripeAccountService) { }

  public onClick = () => {
    this._stripeAccountService.sendAccountLink$().subscribe({
      next: () => {
        console.log('Le lien à correctement été envoyé');
      }, error: (e: Error) => {
        console.log('Error:', e.message);
      }
    })
  }

}
```

#### <mark>Payer un service</mark>

Pour le payement d'un service aplose-framework-ng propose un composant Angular `PaymentComponent`, ce composant contient le `formulaire de carte bancaire`, il prends un `Observable<Service>` par une entrée nommée `service$` et donne en sortie un `Observable<PaymentMethodResult | PaymentIntentResult>` nommé `result$`.

Vous pouvez fournir en entrée du composant un `Observable<Service>`  ou d'une classe qui `hérite de Service` (`Observable<Practice extends Service>`), la classe Service contient les propriétés nécessaires au bon fonctionnement du service, si vous avez besoin que vos entités Service est des propriétés supplémentaires, utiliser une classe qui hérite de Service.

Lors d'un premier achat pour un utilisateur, un compte `Customer` Stripe serat créé automatiquement pour cette utilisateur et sera réutilisé ensuite.

Commencer par importer `NgxStripeModule` dans votre module principale ou dans le module de la page de payement en appelant la méthode `NgxStripeModule.forRoot(stripePublicKey: string)` avec comme argument votre clé publique Stripe.




##### <u>exemple:</u>

checkout.module.ts:

```typescript
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PaymentPageRoutingModule } from './payment-routing.module';

import { PaymentPage } from './payment.page';
import { PaymentComponent } from 'aplose-framework-ng';
import { NgxStripeModule } from 'ngx-stripe';
import { environment } from 'src/environments/environment';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    CheckoutPageRoutingModule,
    CheckoutComponent,
    NgxStripeModule.forRoot(environment.stripePublicKey)
  ],
  declarations: [CheckoutPage]
})
export class PaymentPageModule {}

```

src/app/model/Practice.ts:

```typescript
import { Address, AppointmentType, Service } from "aplose-framework-ng"


export interface Practice extends Service{
    videoUrl: string
    photo: string
    availableAddresses: Address[];
    availableAppointmentTypes: AppointmentType[]
}
```

checkout.page.html:

```html
  <h1>Payer le service {{(practice$ | async)?.name}} à {{(practice$ | async)?.price}} €</h1>

  <lib-payment [service$]="practice$" (result)="result$" />
```

checkout.page.ts:

```typescript
import { Component, OnInit } from '@angular/core';
import { PaymentIntentResult, PaymentMethodResult, ServiceService } from 'aplose-framework-ng';
import { Observable } from 'rxjs';
import { Practice } from 'src/app/model/Practice';

@Component({
  selector: 'app-payment',
  templateUrl: './payment.page.html',
  styleUrls: ['./payment.page.scss'],
})
export class PaymentPage implements OnInit {

  public practice$!: Observable<Practice>;
  public result$!: Observable<PaymentIntentResult | PaymentMethodResult>;

  constructor(private _serviceService: ServiceService) { }

  ngOnInit() {
    this.practice$ = this._serviceService.loadServiceById$(1) as Observable<Practice>;
    this.result$?.subscribe((r) => {
      if(r.error){
        console.log('Une erreur s\'est produite');
      }else{
        console.log('Payement réussi');
      };
    })
  }
}
```









## DictionnaryService

# AploseFrameworkNg

Angular frontend part of AploseFramework

## <u>QuickStart</u>

### <mark>Compiler le package </mark>

- A la racine d'aploseframeworkng, executer `ng build aplose-framework-ng`;

- naviguer vers `./dist/aplose-framework-ng`;

- pour un package en local:
  
  executer `npm pack`, un fichier
  
  `aplose-framework-ng-0.0.1.tgz` est créer dans le repertoire courant; 

- pour publier le package:
  
  executer `npm publish` (attention à incrémenter la sous-version du package à chaques publish. Incrementer la sous-version dans `aploseframeworkng/projects/aplose-framework-ng/package.json` )

### <mark>Installer le package</mark>

#### en local:

- installer le package dans votre application avec `npm install ./chemin/vers/le/package/aplose-framework-ng-0.0.1.tgz`

#### par NPM:

- 

- installer le package via `npm install aplose-framework-ng`

### <mark>Avant de commencer</mark>

- Dans votre application Angular, créer deux variables d'environnement:
1) une variable qui contient l'`url de votre back-end` (back-end integrant `aploseframework`).

2) une variable qui contient votre `id public de client OAuth2.0 Google Cloud` que vous trouverez dans la `Console Google Cloud`.
   Si vous ne possédez pas cette id vous devrez le créer.
   
   voir: https://console.cloud.google.com/apis/credentials

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

  <u>Exemple:</u>

  Dans `app.module.ts`:

```typescript
@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule, 
    IonicModule.forRoot(), 
    AppRoutingModule,
    AploseFrameworkNgModule.forRoot({
      backendUrl: environment.backendUrl,
      googlePublicClientId: environment.googlePublicClientId
    })
  ],
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy }],
  bootstrap: [AppComponent],
})
export class AppModule {}
```





## <u>Google Identity Service</u>

### 

### <mark>Création de compte avec Google Identity Service</mark>

#### Prerequis:

1) Sur votre page de création de compte, vous devez prévoir un conteneur dans lequel le button ***se connecter avec Google*** sera injecté.

2) Votre application dois fournir les deux variables d'environnement `backendUrl` et `googlePublicClientId`, voir `Quickstart/Avant de commencer`

<br/>

#### Utilisation:

Pour créer le boutton `se connecter avec Google`, importer `GoogleAuthService` et appeler la méthode `GoogleAuthService.getRegisterClaimsFromGoogle$(target: HTMLElement, options: GoogleButtonOptions): Observable<GoogleAuthResultDto>`

 (vous pouvez l'appeler au chargement de la page pour avoir le boutton directement).

<br/>

Souscrivez ( .subscribe() ) à l'`Observble<GoogleAuthResultDto>` retourné par la fonction `.getRegisterClaimsFromGoogle$()`, c'est grâce à cette souscription que vous récuperez les informations de l'utilisateur qui s'enregistre avec Google.

<br/>

Lorsque l'utilisateur clique sur le boutton ***se connecter avec Google***, va jusqu'au bout du processus de Google Identity et que vous recevez le GoogleAuthResultDto en réponse, le package à déjà envoyer le token Google à votre back-end , traiter le token , extrait et renvoyé les informations de l'utilisateur à votre application front sans que vous n'ayez rien à faire (grâce à l'intégration d'aploseFramework à votre back-end).

<br/>

Cependant <mark>rien n'est encore enregistré en base de donnés</mark>, de façon à ce que vous puissiez demander des informations supplementaire à votre utilisateur via un formulaire par exemple.

<br/>

Vous pourrez ensuite envoyé le tout ( les informations reçus grâce à Google et les informations supplementaires) en utilisant l'`enregistrement de compte interne` avec la méthode 

`RegisterService.register$(dto: RegisterDto)=>Observable<UserAccount>` .

<br/>
Vous devrez alors envoyer le RegisterDto avec la propriété `authenticationType: AuthneticationTypeEnum` égale à `AuthenticationTypeEnum.GOOGLE`

<u>Exemple:</u>

```typescript
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthenticationTypeEnum, Civility, Country, DictionnaryService, GoogleAuthResultDto, GoogleAuthService, RegisterService } from 'aplose-framework-ng';
import { GoogleButtonOptions } from 'aplose-framework-ng/lib/model/google/GoogleButtonOptions';
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

#### Workflow

1) (front) envoyer le token google au back

2) (back) extraire un UserAccount et le retourner au front

3) (front) voir quelles informations il manque et afficher les inputs en consequent

4) (front) quand l'utilisateur valide le form, envoi du form au back avec les infos de Google + les infos du form

5) (back) enregistrement standard du compte (sans la validation du mail)

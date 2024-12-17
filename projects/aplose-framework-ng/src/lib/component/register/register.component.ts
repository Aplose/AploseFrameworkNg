import { Component, Input, OnInit } from '@angular/core';
import { firstValueFrom, from, map, Observable, of } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../model/Country';
import { Civility } from '../../model/Civility';
import { DictionnaryService } from '../../service/dictionnary.service';
import { AuthenticationTypeEnum } from '../../enum/AuthenticationTypeEnum';
import { RegisterService } from '../../service/authentication/internal/register.service';
import {IonicModule, LoadingController, PopoverController} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { I18nPipe } from '../../pipe/i18n.pipe';
import { CountrySelectorComponent } from '../country-selector/country-selector.component';
import { CountryCode, parsePhoneNumberWithError } from 'libphonenumber-js';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule,
    I18nPipe
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {

  @Input('forceIsProfessional') forceIsProfessional: boolean = false;
  @Input('activateEnterActivationCode') activateEnterActivationCode: boolean = false;

  public countries$!: Observable<Country[]>;
  public civilities$!: Observable<Civility[]>;
  public registerForm!: FormGroup;
  public filteredCountries$!: Observable<Country[]>;
  public selectedCountry: string = ''; // Pays sélectionné

  // false par defaut = affiche le formulaire de register
  // true = affiche le formulaire de validation par code à 4 chiffres
  public validationMode: boolean = false;

  public accountActivationForm!: FormGroup;
  public wrongActivationCode: boolean = false;
  public expiredActivationCode: boolean = false;

  public usernameAllreadyExistError$!: Observable<boolean>;
  public usernameAllreadyExistTimeout!: any;

  isProfessional: boolean = false;
  
  public selectedPhonePrefix: string = '+33';
  public phoneNumberWithoutPrefix: string = '';
  private countryPhonePrefixes: { [key: string]: string } = {
    'FR': '+33',
    'BE': '+32',
    'CH': '+41',
    'ES': '+34',
    'IT': '+39',
    'DE': '+49',
    'US': '+1',
    'GB': '+44',
    'CA': '+1',
    'AU': '+61',
    'NL': '+31',
    'PL': '+48',
    'PT': '+351',
    'RO': '+40',
    'SE': '+46',
    'TR': '+90',
    'UA': '+380',
    'ZA': '+27',
    'IN': '+91',
    'BR': '+55',
    'AR': '+54',
    'MX': '+52',
    'CO': '+57',
    'CL': '+56',
    'PE': '+51',
    'BO': '+591',
    'VE': '+58',
    'EC': '+593',
    'PY': '+595',
    'UY': '+598',
    'CR': '+506',
    'PA': '+507',
    'HN': '+504',
    'NI': '+505',
    'BZ': '+501',
    'GT': '+502',
    'SV': '+503',
    'CU': '+53',
    'JM': '+1',
    'HT': '+509',
    'GY': '+592',
    'SR': '+597'
  };

  public phoneError: string = '';

  constructor(
    private _dictionnaryService: DictionnaryService,
    private _registerService: RegisterService,
    private _router: Router,
    private _popoverCtrl: PopoverController,
    private _loadingCtrl: LoadingController
  ) {}


  public ngOnInit() {
    this.countries$ = this._dictionnaryService.loadCountries$().pipe(
      map((countries: Country[]) => countries.sort((a, b) => a.id - b.id))
    );
    this.filteredCountries$ = from(this.countries$);
    this.civilities$ = this._dictionnaryService.loadCivilities$();

    this.registerForm = new FormGroup({
      userAccountUsername: new FormControl('', [Validators.required, Validators.email]),
      userAccountPassword: new FormControl('', Validators.required),
      passwordRepeat: new FormControl('', Validators.required),
      isProfessional: new FormControl(this.forceIsProfessional),
      firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
      phone: new FormControl('', [
        Validators.required,
        this.phoneNumberValidator()
      ]),
      civilityRowid: new FormControl('', Validators.required),
      addressCountryCode: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      userAccountCompanyName: new FormControl({value: '', disabled: true}, Validators.required),
      authenticationType: new FormControl(AuthenticationTypeEnum.INTERNAL)
    }, { validators: [this.passwordRepeatValidator, this.passwordComplexityValidation, this.countryIsSelectedValidator] });

    if(this.forceIsProfessional){
      this.registerForm.get('userAccountCompanyName')!.enable();
      this.isProfessional = true;
    }else{
      this.registerForm.get('isProfessional')!.valueChanges.subscribe((isProfessional: boolean) => {
        isProfessional ? this.registerForm.get('userAccountCompanyName')!.enable() : this.registerForm.get('userAccountCompanyName')!.disable();
        this.isProfessional = isProfessional;
      });
    }

    this.accountActivationForm = new FormGroup({
      activationCode: new FormControl(null, Validators.required),
    })

    this.selectedPhonePrefix = this.countryPhonePrefixes['FR'];
  }


  public getRegisterForm(): FormGroup{
    return this.registerForm;
  }


    async openCountrySelector(e: any) {
      const popover = await this._popoverCtrl.create({
        component: CountrySelectorComponent,
        componentProps: {
          countries: await firstValueFrom(this.countries$),
          onSelect: (country: Country|null) => {
            if(country == null){
              popover.dismiss();
              return;
            }
            this.selectedCountry = country!.label;
            this.registerForm.get('addressCountryCode')?.setValue(country?.code);
            this.selectedPhonePrefix = this.getPhonePrefix(country.code);
            if (this.phoneNumberWithoutPrefix) {
              const fullNumber = this.selectedPhonePrefix + this.phoneNumberWithoutPrefix.replace(/^0+/, '');
              this.registerForm.get('phone')?.setValue(fullNumber);
              this.validatePhoneNumber();
            }
            popover.dismiss();
          },
          formControlName: 'addressCountryCode'
        },
        event: e,
        size: 'auto'
      });
      await popover.present();
    }

  public async onRegisterFormSubmit(e: Event) {
    e.preventDefault();
    const loading = await this._loadingCtrl.create({
      message: 'Enregistrement en cours...',
      duration: 10000
    });
    loading.present();
      if (this.registerForm.valid) {
        this._registerService.register$(this.registerForm.value)
        .subscribe({
          next: () => {
            loading.dismiss();
            this.activateEnterActivationCode = true;
            this.validationMode = true
          },
          error: (e: HttpErrorResponse) => {
            loading.dismiss();
            console.log('ERROR:', e);
            if(e.status === 409 && e.error === 'This username (email address) allready exist.'){
              this.usernameAllreadyExistError$ = of(true);
              clearTimeout(this.usernameAllreadyExistTimeout);
              this.usernameAllreadyExistTimeout = setTimeout(() => {
                this.usernameAllreadyExistError$ = of(false);
              },
                10000
              )
            }
          }
        });
      }
  }

  public passwordComplexityValidation(formControl: AbstractControl): ValidationErrors | null{
    return null;
    const password = formControl.get('userAccountPassword');
    const validatorRegExp = new RegExp('^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[!?@#$%^&*+-]).{8,}$');
    if(validatorRegExp.test(password?.value)){
      password?.setErrors(null);
    } else {
      password?.setErrors({passwordComplexityTooLow: true});
    }
    return null;
  }

  public passwordRepeatValidator(formControl: AbstractControl): ValidationErrors | null {
    const password = formControl.get('userAccountPassword');
    const passwordRepeat = formControl.get('passwordRepeat');
    if (password && passwordRepeat && password.value !== passwordRepeat.value) {
      passwordRepeat.setErrors({ passwordsMismatch: true });
    } else {
      passwordRepeat?.setErrors(null);
    }
    return null;
  };

  public countryIsSelectedValidator(formControl: AbstractControl): ValidationErrors|null{
    const addressCountryCode = formControl.get('addressCountryCode');
    if(addressCountryCode && addressCountryCode.value != null){
      addressCountryCode?.setErrors(null);
    }else{
      addressCountryCode!.setErrors({countryNotSelected: true})
    }
    return null;
  }


  public async onAccountValidationSubmit(e: Event): Promise<void>{
    if(this.accountActivationForm.valid){
      const loading = await this._loadingCtrl.create({
        message: 'Activation du compte en cours...',
        duration: 5000
      });
      loading.present();
        this._registerService.activateUserAccount$(this.accountActivationForm.get('activationCode')?.value).subscribe({
        next: (result: string) => {
          loading.dismiss();
          this._router.navigate(['/login']);
        },
        error: (httpErrorResponse: HttpErrorResponse)=>{
          loading.dismiss();
          if(httpErrorResponse.status === 400){
            this.wrongActivationCode = true;
            this.expiredActivationCode = false;
            setTimeout(() => {
              this.wrongActivationCode = false;
            }, 5000);
          }
          if(httpErrorResponse.status === 410){
            this.expiredActivationCode = true;
            this.wrongActivationCode = false;
            setTimeout(() => {
              this.expiredActivationCode = false;
            }, 5000);
          }
        },
      })
    }
  }

  onPhoneNumberChange(event: Event): void {
    this.phoneNumberWithoutPrefix = (event.target as HTMLInputElement).value;
    const fullNumber = this.selectedPhonePrefix + this.phoneNumberWithoutPrefix.replace(/^0+/, '');
    this.registerForm.get('phone')?.setValue(fullNumber);
    this.validatePhoneNumber();
  }

  private validatePhoneNumberFormat(phoneNumber: string, countryCode: string | null): { isValid: boolean, error?: string } {
    if (!phoneNumber) {
      return { isValid: false, error: 'Le numéro de téléphone est requis' };
    }

    if (!countryCode) {
      return { isValid: false, error: 'Veuillez sélectionner un pays' };
    }

    try {
      let normalizedNumber = phoneNumber;
      if (!phoneNumber.startsWith('+')) {
        normalizedNumber = this.selectedPhonePrefix + phoneNumber.replace(/^0+/, '');
      }

      const parsedPhoneNumber = parsePhoneNumberWithError(normalizedNumber, countryCode as CountryCode);
      if (!parsedPhoneNumber?.isValid()) {
        return { isValid: false, error: 'Numéro de téléphone invalide' };
      }

      return { isValid: true };
    } catch (e) {
      return { isValid: false, error: 'Format de numéro invalide' };
    }
  }

  private phoneNumberValidator() {
    return (control: FormControl): {[key: string]: any} | null => {
      const value = control.value;
      const countryCode = this.registerForm?.get('addressCountryCode')?.value;
      
      const validation = this.validatePhoneNumberFormat(value, countryCode);
      return validation.isValid ? null : { 'invalidPhone': true };
    };
  }

  private validatePhoneNumber(): void {
    const fullNumber = this.registerForm.get('phone')?.value;
    const countryCode = this.registerForm.get('addressCountryCode')?.value;
    
    const validation = this.validatePhoneNumberFormat(fullNumber, countryCode);
    this.phoneError = validation.error || '';
  }

  private getPhonePrefix(countryCode: string): string {
    return this.countryPhonePrefixes[countryCode] || '+33';
  }
}

import { Component, Input } from '@angular/core';
import { firstValueFrom, from, map, Observable, of } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../model/Country';
import { Civility } from '../../model/Civility';
import { DictionnaryService } from '../../service/dictionnary.service';
import { AuthenticationTypeEnum } from '../../enum/AuthenticationTypeEnum';
import { RegisterService } from '../../service/authentication/internal/register.service';
import {IonicModule, PopoverController} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { CountrySelectorComponent } from '../country-selector/country-selector.component';

@Component({
  selector: 'lib-register',
  standalone: true,
  imports: [
    CommonModule,
    IonicModule,
    ReactiveFormsModule
  ],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent {

  @Input('forceIsProfessional') forceIsProfessional: boolean = false;

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
  

  constructor(
    private _dictionnaryService: DictionnaryService,
    private _registerService: RegisterService,
    private _router: Router,
    private _popoverCtrl: PopoverController
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
      phone: new FormControl('', Validators.required),
      civilityRowid: new FormControl('', Validators.required),
      addressCountryCode: new FormControl(null, [Validators.required, Validators.minLength(2)]),
      userAccountCompanyName: new FormControl({value: '', disabled: true}, Validators.required),
      authenticationType: new FormControl(AuthenticationTypeEnum.INTERNAL)
    }, { validators: [this.passwordRepeatValidator, this.passwordComplexityValidation, this.countryIsSelectedValidator] });

    if(this.forceIsProfessional){
      this.registerForm.get('userAccountCompanyName')!.enable();
    }else{
      this.registerForm.get('isProfessional')!.valueChanges.subscribe((isProfessional: boolean) => {
        isProfessional ? this.registerForm.get('userAccountCompanyName')!.enable() : this.registerForm.get('userAccountCompanyName')!.disable();
      });
    }

    this.accountActivationForm = new FormGroup({
      activationCode: new FormControl(null, Validators.required),
    })
  }


  public getRegisterForm(): FormGroup{
    return this.registerForm;
  }


  // public filterCountries(event: any) {
  //   const searchTerm = event.target.value.toLowerCase();
  //   this.filteredCountries$ = this.countries$.pipe(
  //     map((countries: Country[]) => countries.filter((country: Country) => country.label.toLowerCase().includes(searchTerm)))
  //   )
  //   // this.filteredCountries = this.countries.filter(country =>
  //   //   country.toLowerCase().includes(searchTerm)
  //   // );
  //   }  
    async openCountrySelector(e: any) {
      const popover = await this._popoverCtrl.create({
        component: CountrySelectorComponent, // Composant secondaire pour la sélection
        componentProps: {
          countries: await firstValueFrom(this.countries$),
          onSelect: (country: Country|null) => {
            if(country == null){
              popover.dismiss();
              return;
            }
            this.selectedCountry = country!.label;
            this.registerForm.get('addressCountryCode')?.setValue(country?.code);
            popover.dismiss();
          },
          formControlName: 'addressCountryCode'
        },
        event: e,
        size: 'auto'
      });
      await popover.present();
    }

  public onRegisterFormSubmit(e: Event) {
    e.preventDefault();
      if (this.registerForm.valid) {
        this._registerService.register$(this.registerForm.value)
        .subscribe({
          next: () => {this.validationMode = true},
          error: (e: HttpErrorResponse) => {
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
      console.log('addressCountryCode.value != null:', addressCountryCode.value != null);
      console.log('addressCountryCode:', addressCountryCode ? true : false);
      console.log('addressCountryCode.value != null:', addressCountryCode.value != null);
      
      addressCountryCode?.setErrors(null);
    }else{
      console.log('validator else !!!');
      
      addressCountryCode!.setErrors({countryNotSelected: true})
    }
    return null;
  }


  public onAccountValidationSubmit(e: Event): void{
    if(this.accountActivationForm.valid){
      this._registerService.activateUserAccount$(this.accountActivationForm.get('activationCode')?.value).subscribe({
        next: (result: string) => {
          this._router.navigate(['/login']);
        },
        error: (httpErrorResponse: HttpErrorResponse)=>{
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
}

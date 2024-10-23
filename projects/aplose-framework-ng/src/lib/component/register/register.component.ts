import { Component, Input } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from '../../model/Country';
import { Civility } from '../../model/Civility';
import { DictionnaryService } from '../../service/dictionnary.service';
import { AuthenticationTypeEnum } from '../../enum/AuthenticationTypeEnum';
import { RegisterService } from '../../service/authentication/internal/register.service';
import {IonicModule} from '@ionic/angular'
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

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
  ) {}


  public ngOnInit() {
    this.countries$ = this._dictionnaryService.loadCountries$().pipe(
      map((countries: Country[]) => countries.sort((a, b) => a.id - b.id))
    );
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
      addressCountryCode: new FormControl('', [Validators.required, Validators.minLength(2)]),
      userAccountCompanyName: new FormControl({value: '', disabled: true}, Validators.required),
      authenticationType: new FormControl(AuthenticationTypeEnum.INTERNAL)
    }, { validators: [this.passwordRepeatValidator, this.passwordComplexityValidation] });

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


  public onAccountValidationSubmit(e: Event): void{
    if(this.accountActivationForm.valid){
      this._registerService.activateUserAccount$(this.accountActivationForm.get('activationCode')?.value).subscribe({
        next: ()=>{
          this._router.navigate(['/home']);
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

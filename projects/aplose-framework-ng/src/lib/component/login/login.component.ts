import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { AuthenticationService } from '../../service/authentication/internal/authentication.service';
import { ActivatedRoute, Router } from '@angular/router';
import { GoogleAuthService } from '../../service/authentication/google/google-auth.service';
import { AuthResponseDTO } from '../../dto/AuthResponseDTO';
import { GoogleButtonOptions } from '../../model/google/GoogleButtonOptions';
import { UserAccount } from '../../model/UserAccount';
import { IonText } from "@ionic/angular/standalone";
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { I18nPipe } from '../../pipe/i18n.pipe';

@Component({
  selector: 'lib-login',
  standalone: true,
  imports: [
    IonicModule, 
    ReactiveFormsModule, 
    CommonModule,
    I18nPipe
  ],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {

  private loginMessageTimeout!: any;

  public loginForm!: FormGroup;
  public loginMessageSubject: Subject<string | null> = new Subject<string | null>();
  public loginMessage$: Observable<string | null> = this.loginMessageSubject.asObservable();

  constructor(
    private _authenticationService: AuthenticationService,
    private _route: ActivatedRoute,
    private _router: Router,
    private _googleAuthService: GoogleAuthService
  ) { }

  ngOnInit() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    })
    this._googleAuthService.googleLogin$(document.getElementById('googleButtonContainer')!, {} as GoogleButtonOptions).subscribe((userAccount: UserAccount) => {
      console.log('Bonjour ', userAccount.username, '!');
    })
  }


  public onLoginSubmit() {
    if (this.loginForm.valid) {
      this._authenticationService.login$(this.loginForm.value).subscribe({
        next: (response: AuthResponseDTO | null) => {
          if (response) {
            this._router.navigate([this._route.snapshot.queryParams['returnUrl'] ?? '/'])
          } else {
            this.loginMessageSubject.next('Identifiants incorrectes');
            clearTimeout(this.loginMessageTimeout);
            this.loginMessageTimeout = setTimeout(() => {
              this.loginMessageSubject.next(null);
            }, 5000);
          }

        },
        error: (e: Error) => { console.log('Error:', e.message); }
      });
    }
  }
}

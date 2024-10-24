import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PaymentIntent } from '@stripe/stripe-js';
import { CreateCheckoutDto } from '../../dto/stripe/CreateCheckoutDto';
import { HttpClient } from '@angular/common/http';
import { ConfigService } from '../config.service';

@Injectable({
  providedIn: 'root'
})
export class StripePaymentService {

  constructor(private _httpClient: HttpClient, private _configService: ConfigService) { }


  public sendPaymentMethod$(createCheckoutDto: CreateCheckoutDto ): Observable<PaymentIntent>{
    return this._httpClient.post<PaymentIntent>( `${this._configService.backendUrl}/stripe/checkout`, {
      serviceId: createCheckoutDto.serviceId, 
      paymentMethodId: createCheckoutDto.paymentMethodId
    })
  }
}

import { Component, Input, Output, ViewChild } from '@angular/core';
import { PaymentIntent, PaymentIntentResult, PaymentMethodResult, StripeCardElementOptions, StripeElementsOptions } from '@stripe/stripe-js';
import { NgxStripeModule, StripeCardComponent, StripeService } from 'ngx-stripe';
import { Service } from '../../model/Service';
import { Observable, of } from 'rxjs';
import { StripePaymentService } from '../../service/stripe/stripe-payment.service';

@Component({
  selector: 'lib-payment',
  standalone: true,
  imports: [NgxStripeModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {

  @Input() service$!: Observable<Service>;
  @Output() result: Observable<PaymentMethodResult | PaymentIntentResult> = new Observable<PaymentMethodResult | PaymentIntentResult>();
  public service!: Service;
  private paymentIntent!: PaymentIntent;


  // Référence au composant ngx-stripe-card
  @ViewChild(StripeCardComponent) card!: StripeCardComponent;

    // Options de personnalisation pour l'élément de carte
    public cardOptions: StripeCardElementOptions = {
      style: {
        base: {
          // iconColor: '#666EE8',
          // color: '#31325F',
          // lineHeight: '40px',
          fontWeight: 300,
          fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
          fontSize: '18px',
          '::placeholder': {
            color: '#CFD7E0',
          },
        },
      },
    };
  
    // Options de configuration des éléments Stripe
    public elementsOptions: StripeElementsOptions = {
      locale: 'fr',
      amount: 1,
      mode: 'payment',
      currency: 'eur'
    };

  constructor(
    private _stripeService: StripeService, 
    private _stripePaymentService: StripePaymentService
  ) {}

  ngOnInit() {
    this.service$.subscribe((service: Service) => {
      this.service = service;
    })
  }

  

  public createPaymentMethod() {
    this._stripeService.createPaymentMethod({
      type: 'card',
      card: this.card.element, // Référence au ngx-stripe-card
    }).subscribe((result: PaymentMethodResult) => {
      if (result.error) {
        this.result = of(result);
        console.error('ERROR - createPaymentMethod():', result.error.message);
      } else {
        this._stripePaymentService.sendPaymentMethod$({serviceId: this.service!.id, paymentMethodId: result.paymentMethod.id}).subscribe((paymentIntent: PaymentIntent) => {
          this.paymentIntent = paymentIntent
          this.result = this._stripeService.confirmCardPayment(this.paymentIntent.client_secret!);
          this.result.subscribe(() => {
            console.log("payment successfull");
          });
        });
      }
    });
  }

}

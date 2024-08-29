import { TestBed } from '@angular/core/testing';

import { StripePaymentService } from './stripe-payment.service';

describe('StripePaymentService', () => {
  let service: StripePaymentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripePaymentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

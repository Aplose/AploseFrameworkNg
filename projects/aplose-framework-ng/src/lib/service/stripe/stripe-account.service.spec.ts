import { TestBed } from '@angular/core/testing';

import { StripeAccountService } from './stripe-account.service';

describe('StripeAccountService', () => {
  let service: StripeAccountService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StripeAccountService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

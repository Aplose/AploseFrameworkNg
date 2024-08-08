import { TestBed } from '@angular/core/testing';

import { DictionnaryService } from './dictionnary.service';

describe('DictionnaryService', () => {
  let service: DictionnaryService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DictionnaryService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

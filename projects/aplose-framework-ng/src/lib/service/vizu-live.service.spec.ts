import { TestBed } from '@angular/core/testing';

import { VizuLiveService } from './vizu-live.service';

describe('VizuLiveService', () => {
  let service: VizuLiveService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VizuLiveService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed, inject } from '@angular/core/testing';

import { CustregisterService } from './custregister.service';

describe('CustregisterService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustregisterService]
    });
  });

  it('should be created', inject([CustregisterService], (service: CustregisterService) => {
    expect(service).toBeTruthy();
  }));
});

import { TestBed, inject } from '@angular/core/testing';

import { CustloginService } from './custlogin.service';

describe('CustloginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CustloginService]
    });
  });

  it('should be created', inject([CustloginService], (service: CustloginService) => {
    expect(service).toBeTruthy();
  }));
});

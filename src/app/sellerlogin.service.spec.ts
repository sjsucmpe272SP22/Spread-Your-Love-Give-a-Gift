import { TestBed, inject } from '@angular/core/testing';

import { SellerloginService } from './sellerlogin.service';

describe('SellerloginService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SellerloginService]
    });
  });

  it('should be created', inject([SellerloginService], (service: SellerloginService) => {
    expect(service).toBeTruthy();
  }));
});

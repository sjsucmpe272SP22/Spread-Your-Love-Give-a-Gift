import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellpasswordComponent } from './sellpassword.component';

describe('SellpasswordComponent', () => {
  let component: SellpasswordComponent;
  let fixture: ComponentFixture<SellpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

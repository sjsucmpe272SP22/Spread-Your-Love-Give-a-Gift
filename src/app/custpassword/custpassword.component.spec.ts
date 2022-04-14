import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustpasswordComponent } from './custpassword.component';

describe('CustpasswordComponent', () => {
  let component: CustpasswordComponent;
  let fixture: ComponentFixture<CustpasswordComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustpasswordComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustpasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

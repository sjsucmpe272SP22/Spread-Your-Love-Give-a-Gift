import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustloginComponent } from './custlogin.component';

describe('CustloginComponent', () => {
  let component: CustloginComponent;
  let fixture: ComponentFixture<CustloginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustloginComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustloginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

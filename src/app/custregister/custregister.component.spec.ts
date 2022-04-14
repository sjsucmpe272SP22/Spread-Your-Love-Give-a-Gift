import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustregisterComponent } from './custregister.component';

describe('CustregisterComponent', () => {
  let component: CustregisterComponent;
  let fixture: ComponentFixture<CustregisterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustregisterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustregisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

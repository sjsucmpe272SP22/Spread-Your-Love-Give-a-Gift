import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersalesComponent } from './sellersales.component';

describe('SellersalesComponent', () => {
  let component: SellersalesComponent;
  let fixture: ComponentFixture<SellersalesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellersalesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellersalesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

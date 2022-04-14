import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CustupdateDetailsComponent } from './custupdate-details.component';

describe('CustupdateDetailsComponent', () => {
  let component: CustupdateDetailsComponent;
  let fixture: ComponentFixture<CustupdateDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CustupdateDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustupdateDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

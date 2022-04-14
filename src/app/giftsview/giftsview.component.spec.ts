import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GiftsviewComponent } from './giftsview.component';

describe('GiftsviewComponent', () => {
  let component: GiftsviewComponent;
  let fixture: ComponentFixture<GiftsviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GiftsviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftsviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});

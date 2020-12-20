import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeveolopersComponent } from './deveolopers.component';

describe('DeveolopersComponent', () => {
  let component: DeveolopersComponent;
  let fixture: ComponentFixture<DeveolopersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DeveolopersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DeveolopersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

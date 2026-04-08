import { ComponentFixture, TestBed } from '@angular/core/testing';

import {TimeRegistrationComponent} from './time-registeration';

describe('TimeRegistration', () => {
  let component: TimeRegistrationComponent;
  let fixture: ComponentFixture<TimeRegistrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeRegistrationComponent],
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeRegistrationComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SignOutPage } from './sign-out-page';

describe('SignOutPage', () => {
  let component: SignOutPage;
  let fixture: ComponentFixture<SignOutPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SignOutPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SignOutPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Maintitle } from './maintitle';

describe('Maintitle', () => {
  let component: Maintitle;
  let fixture: ComponentFixture<Maintitle>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Maintitle]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Maintitle);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

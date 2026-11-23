import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ratingsview } from './ratingsview';

describe('Ratingsview', () => {
  let component: RatingsView;
  let fixture: ComponentFixture<RatingsView>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingsView],
    }).compileComponents();

    fixture = TestBed.createComponent(RatingsView);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

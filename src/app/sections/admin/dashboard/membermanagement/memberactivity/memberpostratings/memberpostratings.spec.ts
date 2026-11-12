import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberPostRatings } from './memberpostratings';

describe('Memberpostratings', () => {
  let component: MemberPostRatings;
  let fixture: ComponentFixture<MemberPostRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberPostRatings],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberPostRatings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

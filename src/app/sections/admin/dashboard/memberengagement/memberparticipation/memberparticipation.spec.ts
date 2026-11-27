import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberParticipation } from './memberparticipation';

describe('Memberparticipation', () => {
  let component: MemberParticipation;
  let fixture: ComponentFixture<MemberParticipation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberParticipation],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberParticipation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberActivity } from './memberactivity';

describe('Memberactivity', () => {
  let component: MemberActivity;
  let fixture: ComponentFixture<MemberActivity>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberActivity],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberActivity);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

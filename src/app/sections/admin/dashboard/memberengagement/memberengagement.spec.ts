import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberEngagement } from './memberengagement';

describe('Memberengagement', () => {
  let component: MemberEngagement;
  let fixture: ComponentFixture<MemberEngagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberEngagement],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberEngagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

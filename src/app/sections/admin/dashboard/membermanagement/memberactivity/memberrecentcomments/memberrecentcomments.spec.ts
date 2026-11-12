import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRecentComments } from './memberrecentcomments';

describe('Memberrecentcomments', () => {
  let component: MemberRecentComments;
  let fixture: ComponentFixture<MemberRecentComments>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberRecentComments],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberRecentComments);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

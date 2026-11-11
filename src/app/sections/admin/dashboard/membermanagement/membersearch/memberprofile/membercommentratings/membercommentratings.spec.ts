import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberCommentRatings } from './membercommentratings';

describe('Membercommentratings', () => {
  let component: MemberCommentRatings;
  let fixture: ComponentFixture<MemberCommentRatings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberCommentRatings],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberCommentRatings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

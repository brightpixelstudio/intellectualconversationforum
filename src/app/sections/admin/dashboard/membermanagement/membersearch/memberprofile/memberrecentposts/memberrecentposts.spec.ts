import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberRecentPosts } from './memberrecentposts';

describe('Memberrecentposts', () => {
  let component: MemberRecentPosts;
  let fixture: ComponentFixture<MemberRecentPosts>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberRecentPosts],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberRecentPosts);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

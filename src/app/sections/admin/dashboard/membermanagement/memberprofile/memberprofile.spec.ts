import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberProfile } from './memberprofile';

describe('Memberprofile', () => {
  let component: MemberProfile;
  let fixture: ComponentFixture<MemberProfile>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberProfile],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberProfile);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

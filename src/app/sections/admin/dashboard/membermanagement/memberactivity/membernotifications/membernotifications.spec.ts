import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Membernotifications } from './membernotifications';

describe('Membernotifications', () => {
  let component: MemberNotifications;
  let fixture: ComponentFixture<MemberNotifications>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberNotifications],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberNotifications);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberReported } from './memberreported';

describe('MemberReported', () => {
  let component: MemberReported;
  let fixture: ComponentFixture<MemberReported>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberReported],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberReported);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

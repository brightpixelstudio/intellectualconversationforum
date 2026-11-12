import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberAccountStatusHistory } from './memberaccountstatushistory';

describe('MemberAccountStatusHistory', () => {
  let component: MemberAccountStatusHistory;
  let fixture: ComponentFixture<MemberAccountStatusHistory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberAccountStatusHistory],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberAccountStatusHistory);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

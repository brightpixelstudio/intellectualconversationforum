import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberStatistics } from './memberstatistics';

describe('Memberstatistics', () => {
  let component: MemberStatistics;
  let fixture: ComponentFixture<MemberStatistics>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberStatistics],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberStatistics);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

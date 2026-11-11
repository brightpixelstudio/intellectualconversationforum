import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberManagement } from './membermanagement';

describe('membermanagement', () => {
  let component: MemberManagement;
  let fixture: ComponentFixture<MemberManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

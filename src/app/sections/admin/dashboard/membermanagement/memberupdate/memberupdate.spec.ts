import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberUpdate } from './memberupdate';

describe('Memberupdate', () => {
  let component: MemberUpdate;
  let fixture: ComponentFixture<MemberUpdate>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberUpdate],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberUpdate);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

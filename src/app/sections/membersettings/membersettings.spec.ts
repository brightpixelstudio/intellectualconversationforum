import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSettings } from './membersettings';

describe('MemberSettings', () => {
  let component: MemberSettings;
  let fixture: ComponentFixture<MemberSettings>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSettings],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSettings);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

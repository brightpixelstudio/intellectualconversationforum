import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSettingsPage } from './membersettingspage';

describe('Membersettings', () => {
  let component: MemberSettingsPage;
  let fixture: ComponentFixture<MemberSettingsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSettingsPage],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSettingsPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

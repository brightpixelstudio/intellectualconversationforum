import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiteManagement } from './sitemanagement';

describe('Sitemanagement', () => {
  let component: SiteManagement;
  let fixture: ComponentFixture<SiteManagement>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SiteManagement],
    }).compileComponents();

    fixture = TestBed.createComponent(SiteManagement);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

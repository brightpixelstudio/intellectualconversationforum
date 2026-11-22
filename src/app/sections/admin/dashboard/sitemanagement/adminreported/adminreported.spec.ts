import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminReported } from './adminreported';

describe('Adminreported', () => {
  let component: AdminReported;
  let fixture: ComponentFixture<AdminReported>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminReported],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminReported);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NonActiveMembers } from './nonactivemembers';

describe('Nonactivemembers', () => {
  let component: NonActiveMembers;
  let fixture: ComponentFixture<NonActiveMembers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NonActiveMembers],
    }).compileComponents();

    fixture = TestBed.createComponent(NonActiveMembers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

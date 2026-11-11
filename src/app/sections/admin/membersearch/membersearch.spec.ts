import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MemberSearch } from './membersearch';

describe('Membersearch', () => {
  let component: MemberSearch;
  let fixture: ComponentFixture<MemberSearch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MemberSearch],
    }).compileComponents();

    fixture = TestBed.createComponent(MemberSearch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

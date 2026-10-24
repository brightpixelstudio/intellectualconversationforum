import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewProfilePage } from './viewprofilepage';

describe('Viewprofile', () => {
  let component: ViewProfilePage;
  let fixture: ComponentFixture<ViewProfilePage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ViewProfilePage],
    }).compileComponents();

    fixture = TestBed.createComponent(ViewProfilePage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

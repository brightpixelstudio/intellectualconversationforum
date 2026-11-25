import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Ideas } from './ideas';

describe('Ideas', () => {
  let component: Ideas;
  let fixture: ComponentFixture<Ideas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Ideas],
    }).compileComponents();

    fixture = TestBed.createComponent(Ideas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

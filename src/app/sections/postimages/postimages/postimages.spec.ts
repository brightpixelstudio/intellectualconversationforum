import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Postimages } from './postimages';

describe('Postimages', () => {
  let component: Postimages;
  let fixture: ComponentFixture<Postimages>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Postimages],
    }).compileComponents();

    fixture = TestBed.createComponent(Postimages);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

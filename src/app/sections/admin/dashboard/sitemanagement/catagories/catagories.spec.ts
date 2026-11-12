import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Catagories } from './catagories';

describe('Catagories', () => {
  let component: Catagories;
  let fixture: ComponentFixture<Catagories>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Catagories],
    }).compileComponents();

    fixture = TestBed.createComponent(Catagories);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

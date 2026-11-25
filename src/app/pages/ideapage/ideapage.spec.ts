import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IdeaPage } from './ideapage';

describe('Ideapage', () => {
  let component: IdeaPage;
  let fixture: ComponentFixture<IdeaPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IdeaPage],
    }).compileComponents();

    fixture = TestBed.createComponent(IdeaPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

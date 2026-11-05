import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Post } from './post';

describe('Post', () => {
  let component: PostFull;
  let fixture: ComponentFixture<PostFull>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFull],
    }).compileComponents();

    fixture = TestBed.createComponent(PostFull);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

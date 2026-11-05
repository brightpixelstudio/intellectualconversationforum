import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PostPage } from './postfullpage';

describe('Post', () => {
  let component: PostFullPage;
  let fixture: ComponentFixture<PostFullPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PostFullPage],
    }).compileComponents();

    fixture = TestBed.createComponent(PostFullPage);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

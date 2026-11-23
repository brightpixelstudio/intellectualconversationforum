import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReportPost } from './reportpost';

describe('Reportpost', () => {
  let component: ReportPost;
  let fixture: ComponentFixture<ReportPost>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReportPost],
    }).compileComponents();

    fixture = TestBed.createComponent(ReportPost);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

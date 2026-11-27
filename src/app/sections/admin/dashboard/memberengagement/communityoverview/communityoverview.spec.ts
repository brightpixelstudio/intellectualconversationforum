import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityOverview } from './communityoverview';

describe('Communityoverview', () => {
  let component: CommunityOverview;
  let fixture: ComponentFixture<CommunityOverview>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommunityOverview],
    }).compileComponents();

    fixture = TestBed.createComponent(CommunityOverview);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

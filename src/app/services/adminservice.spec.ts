import { TestBed } from '@angular/core/testing';

import { ApiServiceAdmin } from './adminservice';

describe('Adminservice', () => {
  let service: ApiServiceAdmin;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiServiceAdmin);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

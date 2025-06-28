import { TestBed } from '@angular/core/testing';

import { UserExpesesService } from './user-expeses.service';

describe('UserExpesesService', () => {
  let service: UserExpesesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserExpesesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

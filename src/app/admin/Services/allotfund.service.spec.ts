import { TestBed } from '@angular/core/testing';

import { AllotExpensesService } from './allotfund.service';

describe('AllotExpensesService', () => {
  let service: AllotExpensesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AllotExpensesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

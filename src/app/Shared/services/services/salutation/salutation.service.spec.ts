import { TestBed } from 'projects/user-management/src/app/account/services/account/node_modules/@angular/core/testing';

import { SalutationService } from './salutation.service';

describe('SalutationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SalutationService = TestBed.get(SalutationService);
    expect(service).toBeTruthy();
  });
});

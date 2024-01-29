import { TestBed } from '@angular/core/testing';

import { AccountUserService } from './account-user.service';

describe('AccountUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountUserService = TestBed.get(AccountUserService);
    expect(service).toBeTruthy();
  });
});

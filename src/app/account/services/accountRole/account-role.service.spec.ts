import { TestBed } from '@angular/core/testing';

import { AccountRoleService } from './account-role.service';

describe('AccountRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountRoleService = TestBed.get(AccountRoleService);
    expect(service).toBeTruthy();
  });
});

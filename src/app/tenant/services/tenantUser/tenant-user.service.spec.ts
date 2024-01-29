import { TestBed } from '@angular/core/testing';

import { TenantUserService } from './tenant-user.service';

describe('TenantUserService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantUserService = TestBed.get(TenantUserService);
    expect(service).toBeTruthy();
  });
});

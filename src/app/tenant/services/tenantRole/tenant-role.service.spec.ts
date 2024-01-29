import { TestBed } from '@angular/core/testing';

import { TenantRoleService } from './tenant-role.service';

describe('TenantRoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantRoleService = TestBed.get(TenantRoleService);
    expect(service).toBeTruthy();
  });
});

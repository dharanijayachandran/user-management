import { TestBed } from '@angular/core/testing';

import { TenantRoleMenuService } from './tenant-role-menu.service';

describe('TenantRoleMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantRoleMenuService = TestBed.get(TenantRoleMenuService);
    expect(service).toBeTruthy();
  });
});

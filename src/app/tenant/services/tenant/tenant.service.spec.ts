import { TestBed } from 'projects/user-management/src/app/account/services/account/node_modules/@angular/core/testing';

import { TenantService } from './tenant.service';

describe('TenantService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantService = TestBed.get(TenantService);
    expect(service).toBeTruthy();
  });
});

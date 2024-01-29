import { TestBed } from '@angular/core/testing';

import { TenantMenuService } from './tenant-menu.service';

describe('TenantMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TenantMenuService = TestBed.get(TenantMenuService);
    expect(service).toBeTruthy();
  });
});

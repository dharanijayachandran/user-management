import { TestBed } from '@angular/core/testing';

import { RoleMenuService } from './role-menu.service';

describe('RoleMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleMenuService = TestBed.get(RoleMenuService);
    expect(service).toBeTruthy();
  });
});

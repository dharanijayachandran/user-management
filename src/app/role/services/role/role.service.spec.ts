

import { RoleService } from './role.service';
import { TestBed } from '@angular/core/testing';

describe('RoleService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RoleService = TestBed.get(RoleService);
    expect(service).toBeTruthy();
  });
});

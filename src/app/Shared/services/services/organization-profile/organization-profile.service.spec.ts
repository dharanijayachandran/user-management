import { TestBed } from '@angular/core/testing';

import { OrganizationProfileService } from './organization-profile.service';

describe('OrganizationProfileService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OrganizationProfileService = TestBed.get(OrganizationProfileService);
    expect(service).toBeTruthy();
  });
});

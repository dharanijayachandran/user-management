import { TestBed } from '@angular/core/testing';

import { OwnerMenuService } from './owner-menu.service';

describe('OwnerMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OwnerMenuService = TestBed.get(OwnerMenuService);
    expect(service).toBeTruthy();
  });
});

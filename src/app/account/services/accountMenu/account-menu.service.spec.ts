import { TestBed } from '@angular/core/testing';

import { AccountMenuService } from './account-menu.service';

describe('AccountMenuService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AccountMenuService = TestBed.get(AccountMenuService);
    expect(service).toBeTruthy();
  });
});

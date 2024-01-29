import { TestBed } from '@angular/core/testing';

import { MasterServiceService } from './master-service.service';

describe('MasterServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MasterServiceService = TestBed.get(MasterServiceService);
    expect(service).toBeTruthy();
  });
});

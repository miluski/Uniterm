import { TestBed } from '@angular/core/testing';

import { UnitermService } from './uniterm.service';

describe('UnitermService', () => {
  let service: UnitermService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitermService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

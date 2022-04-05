import { TestBed } from '@angular/core/testing';

import { TrinityLyfeService } from './trinity-lyfe.service';

describe('TrinityLyfeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TrinityLyfeService = TestBed.get(TrinityLyfeService);
    expect(service).toBeTruthy();
  });
});

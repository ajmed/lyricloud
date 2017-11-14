import { TestBed, inject } from '@angular/core/testing';

import { MusixmatchService } from './musixmatch.service';

describe('MusixmatchService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MusixmatchService]
    });
  });

  it('should be created', inject([MusixmatchService], (service: MusixmatchService) => {
    expect(service).toBeTruthy();
  }));
});

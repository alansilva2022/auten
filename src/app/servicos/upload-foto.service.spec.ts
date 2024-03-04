import { TestBed } from '@angular/core/testing';

import { UploadFotoService } from './upload-foto.service';

describe('UploadFotoService', () => {
  let service: UploadFotoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadFotoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

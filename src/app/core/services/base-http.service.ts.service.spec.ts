import { TestBed } from '@angular/core/testing';

import { BaseHttpServiceTsService } from './base-http.service.ts.service';

describe('BaseHttpServiceTsService', () => {
  let service: BaseHttpServiceTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BaseHttpServiceTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

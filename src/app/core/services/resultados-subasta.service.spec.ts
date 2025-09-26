import { TestBed } from '@angular/core/testing';

import { ResultadosSubastaService } from './resultados-subasta.service';

describe('ResultadosSubastaService', () => {
  let service: ResultadosSubastaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResultadosSubastaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

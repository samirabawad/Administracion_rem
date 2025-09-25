import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportacionResultadosComponent } from './importacion-resultados.component';

describe('ImportacionResultadosComponent', () => {
  let component: ImportacionResultadosComponent;
  let fixture: ComponentFixture<ImportacionResultadosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ImportacionResultadosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ImportacionResultadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExtraccionPlanillaComponent } from './extraccion-planilla.component';

describe('ExtraccionPlanillaComponent', () => {
  let component: ExtraccionPlanillaComponent;
  let fixture: ComponentFixture<ExtraccionPlanillaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExtraccionPlanillaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExtraccionPlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

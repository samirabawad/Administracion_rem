import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfiguracionIncrementosComponent } from './configuracion-incrementos.component';

describe('ConfiguracionIncrementosComponent', () => {
  let component: ConfiguracionIncrementosComponent;
  let fixture: ComponentFixture<ConfiguracionIncrementosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ConfiguracionIncrementosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ConfiguracionIncrementosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

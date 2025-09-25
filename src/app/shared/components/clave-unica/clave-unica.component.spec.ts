import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClaveUnicaComponent } from './clave-unica.component';

describe('ClaveUnicaComponent', () => {
  let component: ClaveUnicaComponent;
  let fixture: ComponentFixture<ClaveUnicaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClaveUnicaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClaveUnicaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

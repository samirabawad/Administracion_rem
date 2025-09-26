// src/app/features/callback/callback.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-callback',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div class="text-center">
        <div class="spinner-border text-primary mb-3" role="status">
          <span class="visually-hidden">Cargando...</span>
        </div>
        <h4>Procesando autenticación...</h4>
        <p class="text-muted">{{ statusMessage }}</p>
        
        <div *ngIf="hasError" class="alert alert-danger mt-3">
          <h6>Error de autenticación</h6>
          <p>{{ errorMessage }}</p>
          <button class="btn btn-primary" (click)="redirectToHome()">
            Volver al inicio
          </button>
        </div>
      </div>
    </div>
  `,
  styleUrl: './callback.component.scss'
})
export class CallbackComponent implements OnInit {
  statusMessage = 'Validando credenciales...';
  hasError = false;
  errorMessage = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      const state = params['state'];
      const error = params['error'];

      if (error) {
        this.handleError('Error de Clave Única: ' + error);
        return;
      }

      if (!code || !state) {
        this.handleError('Parámetros de autenticación faltantes');
        return;
      }

      // Verificar el estado para prevenir ataques CSRF
      const savedState = sessionStorage.getItem('claveUnicaState');
      if (!savedState || savedState !== state) {
        this.handleError('Estado de sesión inválido. Posible intento de ataque.');
        return;
      }

      // Limpiar el estado guardado
      sessionStorage.removeItem('claveUnicaState');

      // Procesar el login
      this.processLogin(code, state);
    });
  }

  private processLogin(code: string, state: string): void {
    this.statusMessage = 'Intercambiando código por token...';

    this.authService.loginClaveUnica(code, state).subscribe({
      next: (response) => {
        if (response.success) {
          this.statusMessage = 'Autenticación exitosa. Redirigiendo...';
          setTimeout(() => {
            this.router.navigate(['/empleados']); // O la ruta que corresponda
          }, 1000);
        } else {
          this.handleError(response.message || 'Error en la autenticación');
        }
      },
      error: (error) => {
        console.error('Error en loginClaveUnica:', error);
        this.handleError(error.message || 'Error al procesar la autenticación');
      }
    });
  }

  private handleError(message: string): void {
    this.hasError = true;
    this.errorMessage = message;
    this.statusMessage = 'Error en la autenticación';
    console.error('Callback error:', message);
  }

  redirectToHome(): void {
    this.router.navigate(['/']);
  }
}
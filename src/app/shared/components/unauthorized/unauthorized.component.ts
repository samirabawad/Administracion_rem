// src/app/shared/components/unauthorized/unauthorized.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-unauthorized',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="container-fluid d-flex justify-content-center align-items-center min-vh-100">
      <div class="text-center">
        <div class="mb-4">
          <i class="bi bi-shield-exclamation display-1 text-warning"></i>
        </div>
        <h1 class="h2 mb-3">Acceso no autorizado</h1>
        <p class="text-muted mb-4">
          No tienes permisos suficientes para acceder a esta sección.
        </p>
        <div class="d-flex gap-3 justify-content-center">
          <button class="btn btn-primary" (click)="goHome()">
            <i class="bi bi-house me-2"></i>Ir al inicio
          </button>
          <button class="btn btn-outline-secondary" (click)="goBack()">
            <i class="bi bi-arrow-left me-2"></i>Volver
          </button>
        </div>
        
        <div class="mt-4" *ngIf="currentUser">
          <small class="text-muted">
            Conectado como: <strong>{{ currentUser.empNombre }} {{ currentUser.empApellido }}</strong>
            ({{ currentUser.perfilNombre }})
          </small>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .min-vh-100 {
      min-height: 100vh;
    }
    
    .display-1 {
      font-size: 4rem;
    }
    
    .bi-shield-exclamation {
      color: #ffc107;
    }
  `]
})
export class UnauthorizedComponent {
  currentUser: any = null;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {
    this.currentUser = this.authService.getCurrentUser();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }

  goBack(): void {
    window.history.back();
  }
}
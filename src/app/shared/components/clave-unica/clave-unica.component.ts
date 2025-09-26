// src/app/shared/components/clave-unica/clave-unica.component.ts
import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-clave-unica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clave-unica.component.html',
  styleUrl: './clave-unica.component.scss'
})
export class ClaveUnicaComponent {
  @Input() isMobile: boolean = false;
  @Input() hasMenu: boolean = false;
  @Input() buttonText: string = 'Iniciar sesión';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  /**
   * Generar un token único de sesión
   */
  generateSessionToken(): string {
    const randomPart = window.crypto.getRandomValues(new Uint32Array(4)).join('');
    const timestamp = Date.now().toString(36);
    return `cu_${timestamp}_${randomPart}`.substring(0, 32);
  }

  /**
   * Iniciar login con Clave Única
   */
  loginClaveUnica(): void {
    try {
      // Generar token de estado
      const stateToken = this.generateSessionToken();

      // Guardar estado en sessionStorage
      sessionStorage.setItem('claveUnicaState', stateToken);
      
      // URL codificada correctamente
      const redirectUri = encodeURIComponent(environment.redirecUriClaveUnica);
      
      // Construir URL de autorización
      const authUrl = `https://accounts.claveunica.gob.cl/openid/authorize?` +
        `client_id=${environment.clientIdClaveUnica}&` +
        `response_type=code&` +
        `scope=openid run name&` +
        `redirect_uri=${redirectUri}&` +
        `state=${stateToken}`;

      console.log('Redirigiendo a Clave Única...', authUrl);
      
      // Redirigir a Clave Única
      window.location.href = authUrl;
      
    } catch (error) {
      console.error('Error al iniciar sesión con Clave Única:', error);
      alert('Error al conectar con Clave Única. Intente nuevamente.');
    }
  }

  /**
   * Login manual para desarrollo/testing
   */
  loginManual(): void {
    // Solo para desarrollo - permitir login directo
    if (!environment.production) {
      console.log('Login manual para desarrollo');
      // Aquí podrías implementar un modal de login con usuario/contraseña
    }
  }
}
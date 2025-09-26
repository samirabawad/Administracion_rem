// src/app/core/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment.development';

interface LoginRequest {
  usuario: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  token: string;
  refreshToken: string;
  user: {
    empId: number;
    empUsuario: string;
    empNombre: string;
    empApellido: string;
    empCorreo: string;
    perfilNombre: string;
    sucursalNombre: string;
  };
  message: string;
}

interface User {
  empId: number;
  empUsuario: string;
  empNombre: string;
  empApellido: string;
  empCorreo: string;
  perfilNombre: string;
  sucursalNombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);

  public currentUser$ = this.currentUserSubject.asObservable();
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Verificar si hay una sesión activa al inicializar
    this.checkAuthStatus();
  }

  /**
   * Login con usuario y contraseña
   */
  login(usuario: string, password: string): Observable<LoginResponse> {
    const loginData: LoginRequest = { usuario, password };
    
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginData)
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Login con Clave Única
   */
  loginClaveUnica(code: string, state: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/clave-unica`, { code, state })
      .pipe(
        tap(response => {
          if (response.success) {
            this.setAuthData(response);
          }
        }),
        catchError(this.handleError)
      );
  }

  /**
   * Verificar el estado de autenticación
   */
  checkAuthStatus(): void {
    const token = localStorage.getItem('access_token');
    const userData = localStorage.getItem('user_data');
    
    if (token && userData) {
      try {
        const user = JSON.parse(userData);
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      } catch (error) {
        console.error('Error parsing user data:', error);
        this.clearAuthData();
      }
    }
  }

  /**
   * Verificar si el token es válido
   */
  validateToken(): Observable<boolean> {
    return this.http.get<{ valid: boolean }>(`${this.apiUrl}/validate-token`)
      .pipe(
        map(response => response.valid),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Token inválido'));
        })
      );
  }

  /**
   * Refrescar token
   */
  refreshToken(): Observable<{ token: string }> {
    const refreshToken = localStorage.getItem('refresh_token');
    
    if (!refreshToken) {
      this.logout();
      return throwError(() => new Error('No refresh token'));
    }

    return this.http.post<{ token: string }>(`${this.apiUrl}/refresh`, { refreshToken })
      .pipe(
        tap(response => {
          localStorage.setItem('access_token', response.token);
        }),
        catchError(() => {
          this.logout();
          return throwError(() => new Error('Error refreshing token'));
        })
      );
  }

  /**
   * Logout
   */
  logout(): void {
    // Llamar al endpoint de logout si existe
    const token = localStorage.getItem('access_token');
    if (token) {
      this.http.post(`${this.apiUrl}/logout`, {}).subscribe({
        error: (error) => console.error('Error during logout:', error)
      });
    }

    this.clearAuthData();
    this.router.navigate(['/']);
  }

  /**
   * Obtener token actual
   */
  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  /**
   * Obtener usuario actual
   */
  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  /**
   * Verificar si está autenticado
   */
  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }

  /**
   * Verificar permisos del usuario
   */
  hasPermission(permission: string): boolean {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Implementar lógica de permisos según tu backend
    // Por ejemplo, basado en el perfil del usuario
    const adminProfiles = ['Administrador', 'Super Admin'];
    
    switch (permission) {
      case 'admin':
        return adminProfiles.includes(user.perfilNombre);
      case 'usuario_gestion':
        return ['Administrador', 'Supervisor', 'Super Admin'].includes(user.perfilNombre);
      case 'bienes_gestion':
        return ['Administrador', 'Supervisor', 'Operador', 'Super Admin'].includes(user.perfilNombre);
      default:
        return true;
    }
  }

  /**
   * Establecer datos de autenticación
   */
  private setAuthData(response: LoginResponse): void {
    localStorage.setItem('access_token', response.token);
    localStorage.setItem('refresh_token', response.refreshToken);
    localStorage.setItem('user_data', JSON.stringify(response.user));
    
    this.currentUserSubject.next(response.user);
    this.isAuthenticatedSubject.next(true);
  }

  /**
   * Limpiar datos de autenticación
   */
  private clearAuthData(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');
    
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  /**
   * Manejar errores HTTP
   */
  private handleError(error: any): Observable<never> {
    let errorMessage = 'Error desconocido';
    
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = error.error.message;
    } else {
      // Error del lado del servidor
      if (error.status === 401) {
        errorMessage = 'Credenciales inválidas';
      } else if (error.status === 403) {
        errorMessage = 'No tiene permisos para acceder';
      } else if (error.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.error?.message) {
        errorMessage = error.error.message;
      }
    }
    
    console.error('AuthService Error:', error);
    return throwError(() => new Error(errorMessage));
  }
}
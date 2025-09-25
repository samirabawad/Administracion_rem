// src/app/shared/components/nav-bar/nav-bar.component.ts
import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ClaveUnicaComponent } from '../clave-unica/clave-unica.component';
import { filter } from 'rxjs/operators';

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
}

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, ClaveUnicaComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {

  // Propiedades existentes
  isLoggedIn = false;
  cartItemCount = 0;
  menuOpen: boolean = false;

  // Nuevas propiedades para funcionalidades mejoradas
  userName = '';
  userRole = '';
  userEmail = '';
  notificationCount = 0;
  notifications: Notification[] = [];
  notificationsOpen = false;
  userMenuOpen = false;

  constructor(private router: Router) {}

  ngOnInit(): void {
    // Simular datos de usuario (en producción vendría del servicio de auth)
    this.loadMockUserData();
    this.loadMockNotifications();

    // Cerrar menús al navegar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.closeMenu();
      this.closeAllDropdowns();
    });
  }

  private loadMockUserData(): void {
    // Simular usuario logueado (cambiar según tu lógica de auth)
    this.isLoggedIn = true; // Cambiar a false para probar Clave Única
    this.userName = 'Juan Rodríguez';
    this.userRole = 'Administrador';
    this.userEmail = 'juan.rodriguez@dicrep.cl';
  }

  private loadMockNotifications(): void {
    this.notifications = [
      {
        id: 1,
        title: 'Nueva subasta programada',
        message: 'Se ha programado una nueva subasta para mañana a las 10:00',
        time: 'hace 5 min',
        type: 'info',
        read: false
      },
      {
        id: 2,
        title: 'Datos bancarios actualizados',
        message: 'El comitente María González ha actualizado sus datos bancarios',
        time: 'hace 15 min',
        type: 'success',
        read: false
      },
      {
        id: 3,
        title: 'Error en importación',
        message: 'La importación de resultados falló. Revisar archivo.',
        time: 'hace 1 hora',
        type: 'error',
        read: false
      }
    ];
    this.updateNotificationCount();
  }

  private updateNotificationCount(): void {
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }

  // Métodos existentes mejorados
  closeMenu(): void {
    this.menuOpen = false;
    const menuElement = document.getElementById('navbarContent');
    if (menuElement?.classList.contains('show')) {
      menuElement.classList.remove('show');
    }
  }

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
    this.closeAllDropdowns();
  }

  // Nuevos métodos para funcionalidades mejoradas
  private closeAllDropdowns(): void {
    this.notificationsOpen = false;
    this.userMenuOpen = false;
  }

  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.userMenuOpen = false;
    
    if (this.notificationsOpen) {
      // Marcar notificaciones como leídas cuando se abren
      setTimeout(() => this.markNotificationsAsRead(), 1000);
    }
  }

  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.notificationsOpen = false;
  }

  markNotificationsAsRead(): void {
    this.notifications.forEach(notification => {
      notification.read = true;
    });
    this.updateNotificationCount();
  }

  removeNotification(index: number): void {
    this.notifications.splice(index, 1);
    this.updateNotificationCount();
  }

  clearAllNotifications(): void {
    this.notifications = [];
    this.updateNotificationCount();
    this.notificationsOpen = false;
  }

  logout(): void {
    // Simular logout
    this.isLoggedIn = false;
    this.userName = '';
    this.userRole = '';
    this.userEmail = '';
    this.notifications = [];
    this.notificationCount = 0;
    this.closeMenu();
    this.closeAllDropdowns();
    
    // Redirigir al home o login
    this.router.navigate(['/']);
    
    // Mostrar mensaje de confirmación (opcional)
    console.log('Sesión cerrada correctamente');
  }

  // Simular login exitoso (para testing)
  simulateLogin(): void {
    this.isLoggedIn = true;
    this.loadMockUserData();
    this.loadMockNotifications();
  }

  // Métodos para manejo de permisos (implementar según tu lógica)
  hasPermission(permission: string): boolean {
    // Implementar lógica de permisos
    return true; // Por ahora retorna true para todos
  }

  // Cerrar dropdowns al hacer click fuera
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    // Cerrar notificaciones si click fuera
    if (this.notificationsOpen && !target.closest('.notification-dropdown') && !target.closest('[data-bs-toggle="dropdown"]')) {
      this.notificationsOpen = false;
    }

    // Cerrar menú de usuario si click fuera
    if (this.userMenuOpen && !target.closest('.user-dropdown') && !target.closest('[data-bs-toggle="dropdown"]')) {
      this.userMenuOpen = false;
    }
  }

  // Cerrar menú móvil con Escape
  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
    this.closeAllDropdowns();
  }

  // Prevenir scroll del body cuando el menú móvil está abierto
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 991 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
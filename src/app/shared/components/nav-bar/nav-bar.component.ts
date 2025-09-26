// src/app/shared/components/nav-bar/nav-bar.component.ts
import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router, NavigationEnd } from '@angular/router';
import { ClaveUnicaComponent } from '../clave-unica/clave-unica.component';
import { AuthService } from '../../../core/services/auth.service';
import { filter, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
export class NavBarComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Propiedades de estado
  isLoggedIn = false;
  menuOpen: boolean = false;

  // Datos del usuario
  userName = '';
  userRole = '';
  userEmail = '';
  currentUser: any = null;

  // Notificaciones
  notificationCount = 0;
  notifications: Notification[] = [];
  notificationsOpen = false;
  userMenuOpen = false;

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    // Suscribirse al estado de autenticación
    this.authService.isAuthenticated$
      .pipe(takeUntil(this.destroy$))
      .subscribe(isAuth => {
        this.isLoggedIn = isAuth;
        if (!isAuth) {
          this.clearUserData();
        }
      });

    // Suscribirse a los datos del usuario
    this.authService.currentUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        this.currentUser = user;
        if (user) {
          this.updateUserData(user);
          this.loadNotifications(); // Cargar notificaciones cuando hay usuario
        }
      });

    // Cerrar menús al navegar
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.closeMenu();
      this.closeAllDropdowns();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateUserData(user: any): void {
    this.userName = `${user.empNombre} ${user.empApellido}`;
    this.userRole = user.perfilNombre || 'Usuario';
    this.userEmail = user.empCorreo || '';
  }

  private clearUserData(): void {
    this.userName = '';
    this.userRole = '';
    this.userEmail = '';
    this.currentUser = null;
    this.notifications = [];
    this.notificationCount = 0;
  }

  private loadNotifications(): void {
    // TODO: Implementar carga real de notificaciones desde el backend
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
      }
    ];
    this.updateNotificationCount();
  }

  private updateNotificationCount(): void {
    this.notificationCount = this.notifications.filter(n => !n.read).length;
  }

  // Métodos de navegación y menú
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

  private closeAllDropdowns(): void {
    this.notificationsOpen = false;
    this.userMenuOpen = false;
  }

  // Métodos de notificaciones
  toggleNotifications(): void {
    this.notificationsOpen = !this.notificationsOpen;
    this.userMenuOpen = false;
    
    if (this.notificationsOpen) {
      setTimeout(() => this.markNotificationsAsRead(), 1000);
    }
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

  // Métodos de usuario
  toggleUserMenu(): void {
    this.userMenuOpen = !this.userMenuOpen;
    this.notificationsOpen = false;
  }

  logout(): void {
    this.authService.logout();
    this.closeMenu();
    this.closeAllDropdowns();
  }

  // Métodos de permisos
  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }

  // Event listeners
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;
    
    if (this.notificationsOpen && !target.closest('.notification-dropdown') && !target.closest('[data-bs-toggle="dropdown"]')) {
      this.notificationsOpen = false;
    }

    if (this.userMenuOpen && !target.closest('.user-dropdown') && !target.closest('[data-bs-toggle="dropdown"]')) {
      this.userMenuOpen = false;
    }
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent): void {
    if (this.menuOpen) {
      this.closeMenu();
    }
    this.closeAllDropdowns();
  }

  @HostListener('window:resize', ['$event'])
  onResize(): void {
    if (window.innerWidth > 991 && this.menuOpen) {
      this.closeMenu();
    }
  }
}
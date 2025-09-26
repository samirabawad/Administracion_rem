import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./features/home/components/home/home.component').then(m => m.HomeComponent)
  },
  {
    path: 'callback',
    loadComponent: () => import('./features/callback/callback.component').then(m => m.CallbackComponent)
  },
  {
    path: 'contacto',
    loadComponent: () => import('./features/contacto/contacto.component').then(m => m.ContactoComponent)
  },
  
  // Rutas protegidas - Gestión de Bienes
  {
    path: 'extraccion-planilla',
    loadComponent: () => import('./features/gestion-bienes/extraccion-planilla/components/extraccion-planilla/extraccion-planilla.component').then(m => m.ExtraccionPlanillaComponent),
    canActivate: [AuthGuard],
    data: { permission: 'bienes_gestion' }
  },
  {
    path: 'importacion-resultados',
    loadComponent: () => import('./features/gestion-bienes/importacion-resultados/components/importacion-resultados/importacion-resultados.component').then(m => m.ImportacionResultadosComponent),
    canActivate: [AuthGuard],
    data: { permission: 'bienes_gestion' }
  },
  {
    path: 'configuracion-incrementos',
    loadComponent: () => import('./features/gestion-bienes/configuracion-incrementos/components/configuracion-incrementos/configuracion-incrementos.component').then(m => m.ConfiguracionIncrementosComponent),
    canActivate: [AuthGuard],
    data: { permission: 'admin' }
  },
  {
    path: 'datos-bancarios',
    loadComponent: () => import('./features/gestion-bienes/datos-bancarios/components/datos-bancarios/datos-bancarios.component').then(m => m.DatosBancariosComponent),
    canActivate: [AuthGuard],
    data: { permission: 'bienes_gestion' }
  },
  
  // Rutas protegidas - Usuarios
  {
    path: 'empleados',
    loadComponent: () => import('./features/Usuarios/Empleados/Empleados/empleados.component').then(m => m.EmpleadosComponent),
    canActivate: [AuthGuard],
    data: { permission: 'usuario_gestion' }
  },
  
  // Ruta para usuarios no autorizados
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/login/components/login/login.component').then(m => m.LoginComponent)
  },
  
  // Ruta wildcard - debe ir al final
  {
    path: '**',
    redirectTo: ''
  }
];
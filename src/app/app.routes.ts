import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { CallbackComponent } from './features/callback/callback.component';
import { EmpleadosComponent } from './features/Usuarios/Empleados/Empleados/empleados.component';
import { ExtraccionPlanillaComponent } from './features/gestion-bienes/extraccion-planilla/components/extraccion-planilla/extraccion-planilla.component';
import { ImportacionResultadosComponent } from './features/gestion-bienes/importacion-resultados/components/importacion-resultados/importacion-resultados.component';
import { ConfiguracionIncrementosComponent } from './features/gestion-bienes/configuracion-incrementos/components/configuracion-incrementos/configuracion-incrementos.component';
import { DatosBancariosComponent } from './features/gestion-bienes/datos-bancarios/components/datos-bancarios/datos-bancarios.component';

export const routes: Routes = [

  //Rutas declaradas
  { path: '', component: HomeComponent }, // Ruta por defecto (Home)
  {path: 'callback', component:  CallbackComponent},
  { path: 'contacto', component: ContactoComponent }, // Ruta de login
  { path: 'salir', component: HomeComponent }, // Ruta del carrito
  { path: 'empleados', component: EmpleadosComponent}, //Mantenedor de Sucursales

    // Rutas de Gestión de Bienes
  { path: 'extraccion-planilla', component: ExtraccionPlanillaComponent }, // Extracción de planilla con bienes nuevos
  { path: 'importacion-resultados', component: ImportacionResultadosComponent }, // Importación de resultados de subastas
  { path: 'configuracion-incrementos', component: ConfiguracionIncrementosComponent }, // Configuración de incrementos y porcentajes
  { path: 'datos-bancarios', component: DatosBancariosComponent }, // Actualización de datos bancarios de comitentes
  
  //Rutas generales, no colocar nada debajo de ellas, ya que angular no las tomará
  { path: '**', redirectTo: '' }, // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: '/', pathMatch: 'full' }, // Manejo de rutas no encontradas
  
];

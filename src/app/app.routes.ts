import { Routes } from '@angular/router';
import { HomeComponent } from './features/home/components/home/home.component';
//import { LoginComponent } from './features/auth/login/components/login/login.component';
import { CondicionesComponent } from './features/condiciones/condiciones.component';
import { ContactoComponent } from './features/contacto/contacto.component';
import { CallbackComponent } from './features/callback/callback.component';
import { ComunaComponent } from './features/Ubicaciones/Comunas/comuna/comuna.component';
import { RegionComponent } from './features/Ubicaciones/Regiones/region/region.component';
import { ProvinciaComponent } from './features/Ubicaciones/Provincias/provincia/provincia.component';
import { ClientesComponent } from './features/Usuarios/Clientes/Clientes/clientes.component';
import { EmpleadosComponent } from './features/Usuarios/Empleados/Empleados/empleados.component';

export const routes: Routes = [

  //Rutas declaradas
 { path: '', component: HomeComponent }, // Ruta por defecto (Home)
  {path: 'callback', component:  CallbackComponent},
  {path: 'condiciones', component: CondicionesComponent},
  { path: 'contacto', component: ContactoComponent }, // Ruta de login
  //{ path: 'login', component: LoginComponent }, // Ruta de login,
  { path: 'salir', component: HomeComponent }, // Ruta del carrito
  { path: 'comunas', component: ComunaComponent}, //Mantenedor de Comunas
  { path: 'regiones', component: RegionComponent}, //Mantenedor de Regiones
  { path: 'provincias', component: ProvinciaComponent}, //Mantenedor de Comunas
  { path: 'clientes', component: ClientesComponent}, //Mantenedor de Sucursales
  { path: 'empleados', component: EmpleadosComponent}, //Mantenedor de Sucursales
  //Rutas generales, no colocar nada debajo de ellas, ya que angular no las tomará
  { path: '**', redirectTo: '' }, // Ruta comodín para manejar rutas no encontradas
  { path: '**', redirectTo: '/', pathMatch: 'full' }, // Manejo de rutas no encontradas
  
];

// src/app/features/Usuarios/Empleados/empleados.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from '../../../core/services/base-http.service.ts.service';
import { Empleado } from './empleados.model';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService extends BaseHttpService {
  private endpoint = '/empleado';

  /**
   * Obtener todos los empleados
   */
  getEmpleados(): Observable<Empleado[]> {
    return this.get<Empleado[]>(this.endpoint);
  }

  /**
   * Obtener empleado por ID
   */
  getEmpleadoById(empId: number): Observable<Empleado> {
    return this.get<Empleado>(`${this.endpoint}/${empId}`);
  }

  /**
   * Crear nuevo empleado
   */
  crearEmpleado(empleado: Partial<Empleado>): Observable<Empleado> {
    return this.post<Empleado>(this.endpoint, empleado);
  }

  /**
   * Actualizar empleado existente
   */
  actualizarEmpleado(empId: number, empleado: Partial<Empleado>): Observable<Empleado> {
    return this.put<Empleado>(`${this.endpoint}/${empId}`, empleado);
  }

  /**
   * Eliminar empleado
   */
  eliminarEmpleado(empId: number): Observable<void> {
    return this.delete<void>(`${this.endpoint}/${empId}`);
  }

  /**
   * Cambiar estado del empleado (activar/desactivar)
   */
  cambiarEstadoEmpleado(empId: number, activo: boolean): Observable<Empleado> {
    return this.put<Empleado>(`${this.endpoint}/${empId}/estado`, { activo });
  }

  /**
   * Resetear contraseña
   */
  resetearPassword(empId: number): Observable<{ password: string }> {
    return this.post<{ password: string }>(`${this.endpoint}/${empId}/reset-password`, {});
  }

  /**
   * Obtener perfiles disponibles
   */
  getPerfiles(): Observable<any[]> {
    return this.get<any[]>('/perfil');
  }

  /**
   * Obtener sucursales disponibles
   */
  getSucursales(): Observable<any[]> {
    return this.get<any[]>('/sucursal');
  }

  /**
   * Obtener permisos disponibles
   */
  getPermisos(): Observable<any[]> {
    return this.get<any[]>('/permiso');
  }
}
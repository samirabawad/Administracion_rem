import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Empleado } from './empleados.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class EmpleadosService {
  private apiUrl = `${environment.apiUrl}/empleado`;
  
  constructor(private http: HttpClient) {}

  getEmpleados(): Observable<Empleado[]> {
    return this.http.get<Empleado[]>(this.apiUrl).pipe(
      tap(data => console.log('Empleados recibidos:', data))
    );
  }

  agregarEmpleado(empleado: Empleado): Observable<Empleado> {
    return this.http.post<Empleado>(this.apiUrl, empleado).pipe(
      tap(data => console.log('Empleado creado:', data))
    );
  }

  actualizarEmpleado(empleado: Empleado): Observable<Empleado> {
    const url = `${this.apiUrl}/${empleado.empId}`;
    return this.http.put<Empleado>(url, empleado).pipe(
      tap(data => console.log('Empleado actualizado:', data))
    );
  }

  eliminarEmpleado(empId: number): Observable<void> {
    const url = `${this.apiUrl}/${empId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Empleado con ID ${empId} eliminado`))
    );
  }
}

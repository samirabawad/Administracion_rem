import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Provincia } from './provincia.model';
import { tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class ProvinciaService {
    private apiUrl = `${environment.apiUrl}/provincia`;

  
    constructor(private http: HttpClient) {}

    getProvincias(): Observable<Provincia[]> {
      return this.http.get<Provincia[]>(this.apiUrl).pipe(
        tap(data => console.log('Datos de Provincias recibidos:', data))
      );
    }

      // Métodos futuros: create, update, delete...
      agregarProvincia(provincia: Provincia): Observable<Provincia> {
      return this.http.post<Provincia>(this.apiUrl, provincia).pipe(
        tap(data => console.log('Provincia creada:', data))
      );
      }
    
    
      eliminarProvincia(provinciaId: number): Observable<void> {
      const url = `${this.apiUrl}/${provinciaId}`;
      return this.http.delete<void>(url).pipe(
        tap(() => console.log(`Provincia con ID ${provinciaId} eliminada`))
      );
    }
    
    actualizarProvincia(provincia: Provincia): Observable<Provincia> {
      const url = `${this.apiUrl}/${provincia.provinciaId}`;
      return this.http.put<Provincia>(url, provincia).pipe(
        tap(data => console.log('Provincia actualizada:', data))
      );
    }
    

}

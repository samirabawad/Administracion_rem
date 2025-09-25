import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Region } from './region.model';
import { tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})
export class RegionService {
  private apiUrl = `${environment.apiUrl}/region`;

  constructor(private http: HttpClient) {}
  getRegiones(): Observable<Region[]> {
    return this.http.get<Region[]>(this.apiUrl).pipe(
      tap(data => console.log('Datos de Regiones recibidos:', data))
    );
  }

  // Métodos futuros: create, update, delete...
  agregarRegion(region: Region): Observable<Region> {
  return this.http.post<Region>(this.apiUrl, region).pipe(
    tap(data => console.log('Región creada:', data))
  );
  }


  eliminarRegion(regionId: number): Observable<void> {
  const url = `${this.apiUrl}/${regionId}`;
  return this.http.delete<void>(url).pipe(
    tap(() => console.log(`Región con ID ${regionId} eliminada`))
  );
}

actualizarRegion(region: Region): Observable<Region> {
  const url = `${this.apiUrl}/${region.regionId}`;
  return this.http.put<Region>(url, region).pipe(
    tap(data => console.log('Región actualizada:', data))
  );
}



}


import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Comuna } from './comuna.model';
import { tap } from 'rxjs/operators';
import { environment } from './../../../environments/environment.development';


@Injectable({
  providedIn: 'root'
})

export class ComunaService {

    private apiUrl = `${environment.apiUrl}/comuna`;
  
    constructor(private http: HttpClient) {}
    getComunas(): Observable<Comuna[]> {
      return this.http.get<Comuna[]>(this.apiUrl).pipe(
        tap(data => console.log('Datos de Comunas recibidos:', data))
      );
    }
    // Métodos futuros: create, update, delete...
    agregarComuna(comuna: Comuna): Observable<Comuna> {
    return this.http.post<Comuna>(this.apiUrl, comuna).pipe(
      tap(data => console.log('Comuna creada:', data))
    );
    }
  
  
    eliminarComuna(comunaId: number): Observable<void> {
    const url = `${this.apiUrl}/${comunaId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Comuna con ID ${comunaId} eliminada`))
    );
  }
  
  actualizarComuna(comuna: Comuna): Observable<Comuna> {
    const url = `${this.apiUrl}/${comuna.comunaId}`;
    return this.http.put<Comuna>(url, comuna).pipe(
      tap(data => console.log('Comuna actualizada:', data))
    );
  }
}


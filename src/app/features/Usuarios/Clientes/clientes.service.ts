import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Cliente } from './clientes.model';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class ClientesService {
  private apiUrl = `${environment.apiUrl}/Cliente`;
  
  constructor(private http: HttpClient) {}

  getClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl).pipe(
      tap(data => console.log('Clientes recibidos:', data))
    );
  }

  agregarCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente).pipe(
      tap(data => console.log('Cliente creado:', data))
    );
  }

  actualizarCliente(cliente: Cliente): Observable<Cliente> {
    const url = `${this.apiUrl}/${cliente.clienteId}`;
    return this.http.put<Cliente>(url, cliente).pipe(
      tap(data => console.log('Cliente actualizado:', data))
    );
  }

  eliminarCliente(clienteId: number): Observable<void> {
    const url = `${this.apiUrl}/${clienteId}`;
    return this.http.delete<void>(url).pipe(
      tap(() => console.log(`Cliente con ID ${clienteId} eliminado`))
    );
  }


}

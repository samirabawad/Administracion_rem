// src/app/core/services/resultados-subasta.service.ts
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseHttpService } from './base-http.service.ts.service';

interface CargaResultadoRequest {
  CLPrendaCod: string;
  CLPrendaSubasta?: number;
  EstadoTexto?: string;
  MontoAdjudicacion?: number;
  Adj_Rut?: string;
  Adj_Nombre?: string;
  Adj_ApellidoP?: string;
  EmpId: number;
  PC?: string;
}

interface CargaResultadosLoteRequest {
  Resultados: CargaResultadoRequest[];
  EmpId: number;
  PC?: string;
}

interface CargaResultadoResponse {
  CLPrendaCod: string;
  mensaje: string;
  exito: boolean;
}

interface CargaResultadosLoteResponse {
  TotalProcesados: number;
  TotalExitosos: number;
  TotalErrores: number;
  FechaProcesamiento: Date;
  ResultadosExitosos: CargaResultadoResponse[];
  Errores: Array<{
    CLPrendaCod: string;
    MensajeError: string;
    NumeroFila: number;
  }>;
  Mensaje: string;
}

@Injectable({
  providedIn: 'root'
})
export class ResultadosSubastaService extends BaseHttpService {
  private endpoint = '/CargaResultadoSubasta';

  /**
   * Cargar resultado individual
   */
  cargarResultado(resultado: CargaResultadoRequest): Observable<CargaResultadoResponse> {
    return this.post<CargaResultadoResponse>(`${this.endpoint}/CargarResultado`, resultado);
  }

  /**
   * Cargar resultados en lote
   */
  cargarResultadosLote(request: CargaResultadosLoteRequest): Observable<CargaResultadosLoteResponse> {
    return this.post<CargaResultadosLoteResponse>(`${this.endpoint}/CargarResultadosLote`, request);
  }

  /**
   * Cargar desde archivo Excel
   */
  cargarDesdeExcel(file: File, empId: number, pc?: string): Observable<CargaResultadosLoteResponse> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('empId', empId.toString());
    if (pc) {
      formData.append('pc', pc);
    }

    return this.postFormData<CargaResultadosLoteResponse>(`${this.endpoint}/CargarDesdeExcel`, formData);
  }

  /**
   * Analizar archivo Excel (para preview)
   */
  analizarExcel(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.postFormData<any>(`${this.endpoint}/AnalyzarExcel`, formData);
  }

  /**
   * Obtener formato esperado para Excel
   */
  getFormatoExcel(): Observable<any> {
    return this.get<any>(`${this.endpoint}/FormatoExcel`);
  }
}
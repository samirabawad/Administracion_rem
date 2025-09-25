// src/app/features/gestion-bienes/importacion-resultados/importacion-resultados.component.ts
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface ResultadoSubasta {
  bienCodigo: string;
  bienDescripcion: string;
  valorInicial: number;
  valorFinal?: number;
  estado: 'Vendido' | 'No Vendido';
  comprador?: string;
  compradorRut?: string;
  fechaSubasta: Date;
  comision: number;
  observaciones?: string;
  tieneErrores?: boolean;
  errores?: string[];
}

interface ValidacionError {
  fila: number;
  tipo: 'error' | 'advertencia';
  campo: string;
  mensaje: string;
}

interface ProgresoProcesamiento {
  mostrar: boolean;
  porcentaje: number;
  mensaje: string;
}

interface ImportacionHistorial {
  id: number;
  fecha: Date;
  usuario: string;
  nombreArchivo: string;
  registrosProcesados: number;
  estado: 'Exitoso' | 'Con errores' | 'Fallido';
  observaciones: string;
}

@Component({
  selector: 'app-importacion-resultados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './importacion-resultados.component.html',
  styleUrls: ['./importacion-resultados.component.scss']
})
export class ImportacionResultadosComponent implements OnInit {
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  archivoSeleccionado: File | null = null;
  isDragOver = false;
  procesando = false;
  guardando = false;

  progreso: ProgresoProcesamiento = {
    mostrar: false,
    porcentaje: 0,
    mensaje: ''
  };

  validaciones: ValidacionError[] = [];
  datosPreview: ResultadoSubasta[] = [];
  historialImportaciones: ImportacionHistorial[] = [];

  ngOnInit(): void {
    this.cargarHistorialMock();
  }

  private cargarHistorialMock(): void {
    this.historialImportaciones = [
      {
        id: 1,
        fecha: new Date('2025-01-20T14:30:00'),
        usuario: 'admin@dicrep.cl',
        nombreArchivo: 'resultados_enero_2025.xlsx',
        registrosProcesados: 45,
        estado: 'Exitoso',
        observaciones: 'Importación completada sin errores'
      },
      {
        id: 2,
        fecha: new Date('2025-01-15T09:15:00'),
        usuario: 'operador@dicrep.cl',
        nombreArchivo: 'resultados_diciembre_2024.xlsx',
        registrosProcesados: 38,
        estado: 'Con errores',
        observaciones: '3 registros con errores de validación'
      },
      {
        id: 3,
        fecha: new Date('2025-01-10T16:45:00'),
        usuario: 'supervisor@dicrep.cl',
        nombreArchivo: 'resultados_noviembre_2024.xlsx',
        registrosProcesados: 52,
        estado: 'Exitoso',
        observaciones: 'Proceso completado correctamente'
      }
    ];
  }

  // Eventos de drag & drop
  onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.procesarArchivoSeleccionado(files[0]);
    }
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.procesarArchivoSeleccionado(input.files[0]);
    }
  }

  private procesarArchivoSeleccionado(file: File): void {
    // Validar tipo de archivo
    const tiposPermitidos = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/vnd.ms-excel'
    ];

    if (!tiposPermitidos.includes(file.type)) {
      Swal.fire({
        title: 'Archivo no válido',
        text: 'Solo se permiten archivos Excel (.xlsx, .xls)',
        icon: 'error'
      });
      return;
    }

    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      Swal.fire({
        title: 'Archivo muy grande',
        text: 'El archivo no puede superar los 10MB',
        icon: 'error'
      });
      return;
    }

    this.archivoSeleccionado = file;
    this.limpiarEstado();
  }

  removerArchivo(): void {
    this.archivoSeleccionado = null;
    this.limpiarEstado();
    this.fileInput.nativeElement.value = '';
  }

  private limpiarEstado(): void {
    this.validaciones = [];
    this.datosPreview = [];
    this.progreso.mostrar = false;
  }

  procesarArchivo(): void {
    if (!this.archivoSeleccionado) return;

    this.procesando = true;
    this.progreso.mostrar = true;
    this.progreso.porcentaje = 0;
    this.progreso.mensaje = 'Leyendo archivo...';

    // Simular procesamiento del archivo
    this.simularProcesamiento();
  }

  private simularProcesamiento(): void {
    const pasos = [
      { porcentaje: 20, mensaje: 'Validando estructura del archivo...' },
      { porcentaje: 40, mensaje: 'Leyendo datos...' },
      { porcentaje: 60, mensaje: 'Validando información...' },
      { porcentaje: 80, mensaje: 'Generando preview...' },
      { porcentaje: 100, mensaje: 'Proceso completado' }
    ];

    let pasoActual = 0;

    const intervalId = setInterval(() => {
      if (pasoActual < pasos.length) {
        this.progreso.porcentaje = pasos[pasoActual].porcentaje;
        this.progreso.mensaje = pasos[pasoActual].mensaje;
        pasoActual++;
      } else {
        clearInterval(intervalId);
        this.completarProcesamiento();
      }
    }, 800);
  }

  private completarProcesamiento(): void {
    this.procesando = false;
    
    // Generar datos mock para preview
    this.datosPreview = [
      {
        bienCodigo: 'B-2025-001',
        bienDescripcion: 'Reloj Rolex Submariner - Acero inoxidable',
        valorInicial: 8500000,
        valorFinal: 9200000,
        estado: 'Vendido',
        comprador: 'Carlos Mendoza',
        compradorRut: '12.345.678-9',
        fechaSubasta: new Date('2025-01-25'),
        comision: 15,
        tieneErrores: false
      },
      {
        bienCodigo: 'B-2025-002',
        bienDescripcion: 'Anillo de diamante - Oro blanco 18k',
        valorInicial: 12000000,
        valorFinal: 0,
        estado: 'No Vendido',
        fechaSubasta: new Date('2025-01-25'),
        comision: 0,
        observaciones: 'No hubo ofertas',
        tieneErrores: false
      },
      {
        bienCodigo: 'B-2025-003',
        bienDescripcion: 'Collar de perlas - Perlas cultivadas',
        valorInicial: 3500000,
        valorFinal: 4100000,
        estado: 'Vendido',
        comprador: 'María Silva',
        compradorRut: '15.678.901-2',
        fechaSubasta: new Date('2025-01-25'),
        comision: 12,
        tieneErrores: false
      },
      {
        bienCodigo: 'B-2025-999',
        bienDescripcion: 'Bien con errores de validación',
        valorInicial: 0,
        valorFinal: -1000,
        estado: 'Vendido',
        comprador: '',
        compradorRut: 'RUT-INVÁLIDO',
        fechaSubasta: new Date('2025-01-25'),
        comision: -5,
        tieneErrores: true,
        errores: ['Valor inicial no puede ser 0', 'RUT comprador inválido', 'Comisión no puede ser negativa']
      }
    ];

    // Generar validaciones mock
    this.validaciones = [
      {
        fila: 4,
        tipo: 'error',
        campo: 'valorInicial',
        mensaje: 'El valor inicial no puede ser 0'
      },
      {
        fila: 4,
        tipo: 'error',
        campo: 'compradorRut',
        mensaje: 'Formato de RUT inválido'
      },
      {
        fila: 4,
        tipo: 'error',
        campo: 'comision',
        mensaje: 'La comisión no puede ser negativa'
      }
    ];

    Swal.fire({
      title: 'Archivo procesado',
      text: `Se procesaron ${this.datosPreview.length} registros. ${this.tieneErrores() ? 'Hay errores que deben corregirse.' : 'Todo listo para importar.'}`,
      icon: this.tieneErrores() ? 'warning' : 'success'
    });
  }

  tieneErrores(): boolean {
    return this.validaciones.some(v => v.tipo === 'error');
  }

  confirmarImportacion(): void {
    if (this.tieneErrores()) {
      Swal.fire({
        title: 'No se puede importar',
        text: 'Hay errores que deben corregirse antes de continuar',
        icon: 'error'
      });
      return;
    }

    Swal.fire({
      title: '¿Confirmar importación?',
      text: `Se importarán ${this.datosPreview.filter(d => !d.tieneErrores).length} registros`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, importar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.ejecutarImportacion();
      }
    });
  }

  private ejecutarImportacion(): void {
    this.guardando = true;

    // Simular guardado
    setTimeout(() => {
      this.guardando = false;

      // Agregar al historial
      const nuevaImportacion: ImportacionHistorial = {
        id: this.historialImportaciones.length + 1,
        fecha: new Date(),
        usuario: 'admin@dicrep.cl',
        nombreArchivo: this.archivoSeleccionado!.name,
        registrosProcesados: this.datosPreview.filter(d => !d.tieneErrores).length,
        estado: 'Exitoso',
        observaciones: 'Importación completada correctamente'
      };

      this.historialImportaciones.unshift(nuevaImportacion);

      Swal.fire({
        title: '¡Importación exitosa!',
        text: `Se han importado ${nuevaImportacion.registrosProcesados} registros`,
        icon: 'success'
      });

      // Limpiar formulario
      this.removerArchivo();
      this.limpiarEstado();
    }, 2000);
  }

  descargarPlantilla(): void {
    Swal.fire({
      title: 'Descargando plantilla...',
      text: 'Se iniciará la descarga del archivo de plantilla',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
    
    // Aquí iría la lógica para descargar la plantilla
    console.log('Descargando plantilla de importación...');
  }

  verEjemplo(): void {
    Swal.fire({
      title: 'Ejemplo de archivo',
      html: `
        <div class="text-start">
          <p><strong>Estructura del archivo Excel:</strong></p>
          <table class="table table-sm">
            <thead>
              <tr>
                <th>Columna A</th>
                <th>Columna B</th>
                <th>Columna C</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Código Bien</td>
                <td>Estado</td>
                <td>Valor Final</td>
              </tr>
              <tr>
                <td>B-2025-001</td>
                <td>Vendido</td>
                <td>9200000</td>
              </tr>
            </tbody>
          </table>
        </div>
      `,
      width: '600px'
    });
  }

  exportarErrores(): void {
    Swal.fire({
      title: 'Exportando errores...',
      text: 'Se generará un archivo Excel con los errores encontrados',
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  }

  verDetallesImportacion(importacion: ImportacionHistorial): void {
    Swal.fire({
      title: 'Detalles de Importación',
      html: `
        <div class="text-start">
          <p><strong>Archivo:</strong> ${importacion.nombreArchivo}</p>
          <p><strong>Fecha:</strong> ${importacion.fecha.toLocaleString()}</p>
          <p><strong>Usuario:</strong> ${importacion.usuario}</p>
          <p><strong>Registros:</strong> ${importacion.registrosProcesados}</p>
          <p><strong>Estado:</strong> ${importacion.estado}</p>
          <p><strong>Observaciones:</strong> ${importacion.observaciones}</p>
        </div>
      `,
      width: '500px'
    });
  }

  descargarLog(importacion: ImportacionHistorial): void {
    Swal.fire({
      title: 'Descargando log...',
      text: `Se descargará el log de la importación del ${importacion.fecha.toLocaleDateString()}`,
      icon: 'info',
      timer: 2000,
      showConfirmButton: false
    });
  }
}
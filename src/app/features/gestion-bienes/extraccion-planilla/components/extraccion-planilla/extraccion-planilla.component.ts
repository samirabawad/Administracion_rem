// src/app/features/gestion-bienes/extraccion-planilla/extraccion-planilla.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';


interface Bien {
  bienId: number;
  bienCodigo: string;
  bienDescripcion: string;
  bienValorInicial: number;
  bienValorRemate?: number;
  bienIncremento: number;
  bienPorcentaje: number;
  bienEstado: 'Nuevo' | 'En Subasta' | 'Vendido' | 'No Vendido';
  bienFechaIngreso: Date;
  bienFechaSubasta?: Date;
  comitenteId: number;
  comitenteNombre: string;
  seleccionado?: boolean;
}

interface FiltrosExtraccion {
  fechaDesde: string;
  fechaHasta: string;
  estado: string;
  comitente: string;
}

@Component({
  selector: 'app-extraccion-planilla',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './extraccion-planilla.component.html',
  styleUrls: ['./extraccion-planilla.component.scss']
})
export class ExtraccionPlanillaComponent implements OnInit {
  bienes: Bien[] = [];
  bienesFiltrados: Bien[] = [];
  
  filtros: FiltrosExtraccion = {
    fechaDesde: '',
    fechaHasta: '',
    estado: '',
    comitente: ''
  };

  ngOnInit(): void {
    this.cargarDatosMock();
    this.aplicarFiltros();
  }

  private cargarDatosMock(): void {
    // Datos simulados para desarrollo
    this.bienes = [
      {
        bienId: 1,
        bienCodigo: 'B-2025-001',
        bienDescripcion: 'Reloj Rolex Submariner - Acero inoxidable, esfera negra, certificado de autenticidad',
        bienValorInicial: 8500000,
        bienIncremento: 100000,
        bienPorcentaje: 5,
        bienEstado: 'Nuevo',
        bienFechaIngreso: new Date('2025-01-15'),
        comitenteId: 1,
        comitenteNombre: 'Juan Pérez Soto',
        seleccionado: false
      },
      {
        bienId: 2,
        bienCodigo: 'B-2025-002',
        bienDescripcion: 'Anillo de diamante - Oro blanco 18k, diamante central 2.5 quilates, certificado GIA',
        bienValorInicial: 12000000,
        bienIncremento: 150000,
        bienPorcentaje: 5,
        bienEstado: 'En Subasta',
        bienFechaIngreso: new Date('2025-01-14'),
        bienFechaSubasta: new Date('2025-02-01'),
        comitenteId: 2,
        comitenteNombre: 'María González Díaz',
        seleccionado: false
      },
      {
        bienId: 3,
        bienCodigo: 'B-2025-003',
        bienDescripcion: 'Collar de perlas - Perlas cultivadas japonesas, broche de oro amarillo 14k',
        bienValorInicial: 3500000,
        bienIncremento: 50000,
        bienPorcentaje: 3,
        bienEstado: 'Nuevo',
        bienFechaIngreso: new Date('2025-01-16'),
        comitenteId: 3,
        comitenteNombre: 'Carlos Rodríguez M.',
        seleccionado: false
      },
      {
        bienId: 4,
        bienCodigo: 'B-2025-004',
        bienDescripcion: 'Pulsera de oro - Oro amarillo 18k, diseño trenzado, 45 gramos',
        bienValorInicial: 2800000,
        bienIncremento: 40000,
        bienPorcentaje: 4,
        bienEstado: 'Nuevo',
        bienFechaIngreso: new Date('2025-01-17'),
        comitenteId: 1,
        comitenteNombre: 'Juan Pérez Soto',
        seleccionado: false
      },
      {
        bienId: 5,
        bienCodigo: 'B-2025-005',
        bienDescripcion: 'Pendientes de esmeraldas - Esmeraldas colombianas, montura de platino',
        bienValorInicial: 6800000,
        bienIncremento: 80000,
        bienPorcentaje: 5,
        bienEstado: 'En Subasta',
        bienFechaIngreso: new Date('2025-01-12'),
        bienFechaSubasta: new Date('2025-02-05'),
        comitenteId: 4,
        comitenteNombre: 'Ana Silva Torres',
        seleccionado: false
      },
      {
        bienId: 6,
        bienCodigo: 'B-2025-006',
        bienDescripcion: 'Reloj Cartier Tank - Acero y oro, correa de cuero, caja original',
        bienValorInicial: 4200000,
        bienIncremento: 60000,
        bienPorcentaje: 4,
        bienEstado: 'Nuevo',
        bienFechaIngreso: new Date('2025-01-18'),
        comitenteId: 2,
        comitenteNombre: 'María González Díaz',
        seleccionado: false
      }
    ];
  }

  aplicarFiltros(): void {
    this.bienesFiltrados = this.bienes.filter(bien => {
      let cumpleFiltro = true;

      // Filtro por fecha desde
      if (this.filtros.fechaDesde) {
        const fechaDesde = new Date(this.filtros.fechaDesde);
        cumpleFiltro = cumpleFiltro && bien.bienFechaIngreso >= fechaDesde;
      }

      // Filtro por fecha hasta
      if (this.filtros.fechaHasta) {
        const fechaHasta = new Date(this.filtros.fechaHasta);
        cumpleFiltro = cumpleFiltro && bien.bienFechaIngreso <= fechaHasta;
      }

      // Filtro por estado
      if (this.filtros.estado) {
        cumpleFiltro = cumpleFiltro && bien.bienEstado === this.filtros.estado;
      }

      // Filtro por comitente
      if (this.filtros.comitente) {
        cumpleFiltro = cumpleFiltro && bien.comitenteNombre
          .toLowerCase()
          .includes(this.filtros.comitente.toLowerCase());
      }

      return cumpleFiltro;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      fechaDesde: '',
      fechaHasta: '',
      estado: '',
      comitente: ''
    };
    this.aplicarFiltros();
  }

  toggleSeleccionarTodos(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.bienesFiltrados.forEach(bien => bien.seleccionado = seleccionado);
  }

  todoSeleccionado(): boolean {
    return this.bienesFiltrados.length > 0 && 
           this.bienesFiltrados.every(bien => bien.seleccionado);
  }

  haySeleccionados(): boolean {
    return this.bienesFiltrados.some(bien => bien.seleccionado);
  }

  contarSeleccionados(): number {
    return this.bienesFiltrados.filter(bien => bien.seleccionado).length;
  }

  contarPorEstado(estado: string): number {
    return this.bienesFiltrados.filter(bien => bien.bienEstado === estado).length;
  }

  calcularValorTotal(): number {
    return this.bienesFiltrados.reduce((total, bien) => total + bien.bienValorInicial, 0);
  }

  exportarSeleccionados(): void {
    const seleccionados = this.bienesFiltrados.filter(bien => bien.seleccionado);
    
    Swal.fire({
      title: '¿Exportar bienes seleccionados?',
      text: `Se exportarán ${seleccionados.length} bienes a Excel`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, exportar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#28a745'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarExportacion(seleccionados);
      }
    });
  }

  exportarTodos(): void {
    Swal.fire({
      title: '¿Exportar todos los bienes?',
      text: `Se exportarán ${this.bienesFiltrados.length} bienes a Excel`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, exportar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#17a2b8'
    }).then((result) => {
      if (result.isConfirmed) {
        this.procesarExportacion(this.bienesFiltrados);
      }
    });
  }

  private procesarExportacion(bienes: Bien[]): void {
    // Simular procesamiento de exportación
    Swal.fire({
      title: 'Generando archivo...',
      html: 'Por favor espere mientras se genera el archivo Excel',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Simular delay de procesamiento
    setTimeout(() => {
      Swal.fire({
        title: '¡Exportación exitosa!',
        text: `Se han exportado ${bienes.length} bienes correctamente`,
        icon: 'success',
        confirmButtonText: 'Entendido'
      });

      // Aquí iría la lógica real de exportación
      console.log('Datos a exportar:', bienes);
    }, 2000);
  }
}
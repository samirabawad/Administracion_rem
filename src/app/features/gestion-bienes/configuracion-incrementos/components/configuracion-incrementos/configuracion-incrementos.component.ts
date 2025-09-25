// src/app/features/gestion-bienes/configuracion-incrementos/configuracion-incrementos.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface ConfiguracionIncremento {
  configId: number;
  rangoMinimo: number;
  rangoMaximo: number;
  incremento: number;
  porcentaje: number;
  activo: boolean;
  fechaCreacion: Date;
  fechaModificacion: Date;
  seleccionado?: boolean;
}

interface CambioHistorial {
  id: number;
  fecha: Date;
  usuario: string;
  accion: 'Crear' | 'Editar' | 'Activar' | 'Desactivar' | 'Eliminar';
  configuracion: string;
  detalles: string;
}

@Component({
  selector: 'app-configuracion-incrementos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './configuracion-incrementos.component.html',
  styleUrls: ['./configuracion-incrementos.component.scss']
})
export class ConfiguracionIncrementosComponent implements OnInit, AfterViewChecked {
  @ViewChild('rangoMinimoInput') rangoMinimoInput!: ElementRef<HTMLInputElement>;

  // Modal
  modalVisible = false;
  private modalAbiertoPrev = false;
  modoEdicion = false;
  configuracionEditandoId: number | null = null;

  // Formulario
  nuevaConfiguracion: Partial<ConfiguracionIncremento> = {
    activo: true
  };

  // Datos
  configuraciones: ConfiguracionIncremento[] = [];
  configuracionesFiltradas: ConfiguracionIncremento[] = [];
  historialCambios: CambioHistorial[] = [];

  // Filtros
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';
  filtroRangoMin: number | null = null;
  filtroRangoMax: number | null = null;

  ngOnInit(): void {
    this.cargarDatosMock();
    this.cargarHistorialMock();
    this.aplicarFiltros();
  }

  private cargarDatosMock(): void {
    this.configuraciones = [
      {
        configId: 1,
        rangoMinimo: 0,
        rangoMaximo: 1000000,
        incremento: 10000,
        porcentaje: 3,
        activo: true,
        fechaCreacion: new Date('2024-12-01'),
        fechaModificacion: new Date('2025-01-15T10:30:00'),
        seleccionado: false
      },
      {
        configId: 2,
        rangoMinimo: 1000001,
        rangoMaximo: 5000000,
        incremento: 50000,
        porcentaje: 5,
        activo: true,
        fechaCreacion: new Date('2024-12-01'),
        fechaModificacion: new Date('2025-01-10T14:20:00'),
        seleccionado: false
      },
      {
        configId: 3,
        rangoMinimo: 5000001,
        rangoMaximo: 15000000,
        incremento: 100000,
        porcentaje: 7,
        activo: true,
        fechaCreacion: new Date('2024-12-01'),
        fechaModificacion: new Date('2025-01-05T09:15:00'),
        seleccionado: false
      },
      {
        configId: 4,
        rangoMinimo: 15000001,
        rangoMaximo: 50000000,
        incremento: 250000,
        porcentaje: 10,
        activo: true,
        fechaCreacion: new Date('2024-12-01'),
        fechaModificacion: new Date('2024-12-20T16:45:00'),
        seleccionado: false
      },
      {
        configId: 5,
        rangoMinimo: 50000001,
        rangoMaximo: 999999999,
        incremento: 500000,
        porcentaje: 15,
        activo: false,
        fechaCreacion: new Date('2024-11-15'),
        fechaModificacion: new Date('2025-01-08T11:30:00'),
        seleccionado: false
      },
      {
        configId: 6,
        rangoMinimo: 2000000,
        rangoMaximo: 3000000,
        incremento: 25000,
        porcentaje: 4,
        activo: false,
        fechaCreacion: new Date('2024-11-20'),
        fechaModificacion: new Date('2024-12-15T13:20:00'),
        seleccionado: false
      }
    ];
  }

  private cargarHistorialMock(): void {
    this.historialCambios = [
      {
        id: 1,
        fecha: new Date('2025-01-20T14:30:00'),
        usuario: 'admin@dicrep.cl',
        accion: 'Editar',
        configuracion: '$0 - $1.000.000',
        detalles: 'Incremento cambiado de $8.000 a $10.000'
      },
      {
        id: 2,
        fecha: new Date('2025-01-18T09:15:00'),
        usuario: 'supervisor@dicrep.cl',
        accion: 'Desactivar',
        configuracion: '$50.000.001 - $999.999.999',
        detalles: 'Configuration desactivada temporalmente'
      },
      {
        id: 3,
        fecha: new Date('2025-01-15T16:45:00'),
        usuario: 'operador@dicrep.cl',
        accion: 'Crear',
        configuracion: '$2.000.000 - $3.000.000',
        detalles: 'Nueva configuración para rango específico'
      },
      {
        id: 4,
        fecha: new Date('2025-01-10T11:20:00'),
        usuario: 'admin@dicrep.cl',
        accion: 'Activar',
        configuracion: '$1.000.001 - $5.000.000',
        detalles: 'Configuración reactivada después de revisión'
      }
    ];
  }

  aplicarFiltros(): void {
    this.configuracionesFiltradas = this.configuraciones.filter(config => {
      let cumpleFiltro = true;

      // Filtro por estado
      if (this.filtroEstado === 'activos') {
        cumpleFiltro = cumpleFiltro && config.activo;
      } else if (this.filtroEstado === 'inactivos') {
        cumpleFiltro = cumpleFiltro && !config.activo;
      }

      // Filtro por rango mínimo
      if (this.filtroRangoMin !== null) {
        cumpleFiltro = cumpleFiltro && config.rangoMinimo >= this.filtroRangoMin;
      }

      // Filtro por rango máximo
      if (this.filtroRangoMax !== null) {
        cumpleFiltro = cumpleFiltro && config.rangoMaximo <= this.filtroRangoMax;
      }

      return cumpleFiltro;
    });
  }

  limpiarFiltros(): void {
    this.filtroEstado = 'todos';
    this.filtroRangoMin = null;
    this.filtroRangoMax = null;
    this.aplicarFiltros();
  }

  contarActivas(): number {
    return this.configuraciones.filter(config => config.activo).length;
  }

  contarInactivas(): number {
    return this.configuraciones.filter(config => !config.activo).length;
  }

  calcularRangoTotal(): number {
    const activas = this.configuraciones.filter(config => config.activo);
    return activas.reduce((total, config) => total + (config.rangoMaximo - config.rangoMinimo), 0);
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.modoEdicion = false;
    this.configuracionEditandoId = null;
    this.nuevaConfiguracion = {
      activo: true
    };
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevaConfiguracion = {};
    this.modoEdicion = false;
    this.configuracionEditandoId = null;
    document.body.style.overflow = '';
  }

  editarConfiguracion(config: ConfiguracionIncremento): void {
    this.modoEdicion = true;
    this.configuracionEditandoId = config.configId;
    this.nuevaConfiguracion = { ...config };
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  guardarConfiguracion(): void {
    if (this.validarConfiguracion()) {
      const configAGuardar: ConfiguracionIncremento = {
        ...this.nuevaConfiguracion,
        configId: this.configuracionEditandoId ?? this.configuraciones.length + 1,
        fechaCreacion: this.modoEdicion ? 
          this.configuraciones.find(c => c.configId === this.configuracionEditandoId)!.fechaCreacion :
          new Date(),
        fechaModificacion: new Date()
      } as ConfiguracionIncremento;

      if (this.modoEdicion && this.configuracionEditandoId !== null) {
        const index = this.configuraciones.findIndex(c => c.configId === this.configuracionEditandoId);
        if (index !== -1) {
          this.configuraciones[index] = { ...configAGuardar, seleccionado: false };
          this.agregarAlHistorial('Editar', this.formatearRango(configAGuardar), 'Configuración actualizada');
        }
      } else {
        this.configuraciones.push({ ...configAGuardar, seleccionado: false });
        this.agregarAlHistorial('Crear', this.formatearRango(configAGuardar), 'Nueva configuración creada');
      }

      this.aplicarFiltros();
      this.cerrarModal();

      Swal.fire({
        title: this.modoEdicion ? '¡Configuración actualizada!' : '¡Configuración creada!',
        text: `Rango: ${this.formatearRango(configAGuardar)}`,
        icon: 'success'
      });
    }
  }

  private validarConfiguracion(): boolean {
    // Validar que no se solapen los rangos con otras configuraciones activas
    const rangoMin = this.nuevaConfiguracion.rangoMinimo!;
    const rangoMax = this.nuevaConfiguracion.rangoMaximo!;

    const configuracionesActivas = this.configuraciones.filter(c => 
      c.activo && c.configId !== this.configuracionEditandoId
    );

    for (const config of configuracionesActivas) {
      if ((rangoMin <= config.rangoMaximo && rangoMax >= config.rangoMinimo)) {
        Swal.fire({
          title: 'Rango superpuesto',
          text: `El rango se superpone con la configuración existente: ${this.formatearRango(config)}`,
          icon: 'error'
        });
        return false;
      }
    }

    return true;
  }

  private formatearRango(config: ConfiguracionIncremento): string {
    return `${config.rangoMinimo.toLocaleString()} - ${config.rangoMaximo.toLocaleString()}`;
  }

  toggleEstado(config: ConfiguracionIncremento): void {
    const accion = config.activo ? 'Desactivar' : 'Activar';
    const textoAccion = config.activo ? 'desactivar' : 'activar';

    Swal.fire({
      title: `¿${accion} configuración?`,
      text: `Se va a ${textoAccion} la configuración para el rango ${this.formatearRango(config)}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${textoAccion}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        config.activo = !config.activo;
        config.fechaModificacion = new Date();
        this.agregarAlHistorial(accion, this.formatearRango(config), `Configuración ${textoAccion}da`);
        
        Swal.fire({
          title: `¡Configuración ${textoAccion}da!`,
          text: `La configuración ha sido ${textoAccion}da correctamente`,
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  eliminarConfiguracion(configId: number): void {
    const config = this.configuraciones.find(c => c.configId === configId);
    if (!config) return;

    Swal.fire({
      title: '¿Eliminar configuración?',
      text: `Se eliminará la configuración para el rango ${this.formatearRango(config)}. Esta acción no se puede deshacer.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        this.configuraciones = this.configuraciones.filter(c => c.configId !== configId);
        this.agregarAlHistorial('Eliminar', this.formatearRango(config), 'Configuración eliminada permanentemente');
        
        Swal.fire({
          title: '¡Configuración eliminada!',
          text: 'La configuración ha sido eliminada correctamente',
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  toggleSeleccionarTodos(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.configuracionesFiltradas.forEach(config => config.seleccionado = seleccionado);
  }

  todoSeleccionado(): boolean {
    return this.configuracionesFiltradas.length > 0 && 
           this.configuracionesFiltradas.every(config => config.seleccionado);
  }

  haySeleccionados(): boolean {
    return this.configuracionesFiltradas.some(config => config.seleccionado);
  }

  contarSeleccionados(): number {
    return this.configuracionesFiltradas.filter(config => config.seleccionado).length;
  }

  activarSeleccionadas(): void {
    const seleccionadas = this.configuracionesFiltradas.filter(config => config.seleccionado && !config.activo);
    
    if (seleccionadas.length === 0) {
      Swal.fire({
        title: 'Sin configuraciones para activar',
        text: 'No hay configuraciones inactivas seleccionadas',
        icon: 'info'
      });
      return;
    }

    Swal.fire({
      title: `¿Activar ${seleccionadas.length} configuraciones?`,
      text: 'Se activarán todas las configuraciones seleccionadas',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionadas.forEach(config => {
          config.activo = true;
          config.fechaModificacion = new Date();
          config.seleccionado = false;
          this.agregarAlHistorial('Activar', this.formatearRango(config), 'Activación masiva');
        });

        Swal.fire({
          title: '¡Configuraciones activadas!',
          text: `Se activaron ${seleccionadas.length} configuraciones`,
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  desactivarSeleccionadas(): void {
    const seleccionadas = this.configuracionesFiltradas.filter(config => config.seleccionado && config.activo);
    
    if (seleccionadas.length === 0) {
      Swal.fire({
        title: 'Sin configuraciones para desactivar',
        text: 'No hay configuraciones activas seleccionadas',
        icon: 'info'
      });
      return;
    }

    Swal.fire({
      title: `¿Desactivar ${seleccionadas.length} configuraciones?`,
      text: 'Se desactivarán todas las configuraciones seleccionadas',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionadas.forEach(config => {
          config.activo = false;
          config.fechaModificacion = new Date();
          config.seleccionado = false;
          this.agregarAlHistorial('Desactivar', this.formatearRango(config), 'Desactivación masiva');
        });

        Swal.fire({
          title: '¡Configuraciones desactivadas!',
          text: `Se desactivaron ${seleccionadas.length} configuraciones`,
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  eliminarSeleccionadas(): void {
    const seleccionadas = this.configuracionesFiltradas.filter(config => config.seleccionado);
    
    if (seleccionadas.length === 0) {
      Swal.fire({
        title: 'Sin configuraciones seleccionadas',
        text: 'No hay configuraciones seleccionadas para eliminar',
        icon: 'info'
      });
      return;
    }

    Swal.fire({
      title: `¿Eliminar ${seleccionadas.length} configuraciones?`,
      text: 'Se eliminarán todas las configuraciones seleccionadas. Esta acción no se puede deshacer.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#dc3545'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionadas.forEach(config => {
          this.agregarAlHistorial('Eliminar', this.formatearRango(config), 'Eliminación masiva');
        });

        const idsEliminar = seleccionadas.map(config => config.configId);
        this.configuraciones = this.configuraciones.filter(config => !idsEliminar.includes(config.configId));

        Swal.fire({
          title: '¡Configuraciones eliminadas!',
          text: `Se eliminaron ${seleccionadas.length} configuraciones`,
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  private agregarAlHistorial(accion: CambioHistorial['accion'], configuracion: string, detalles: string): void {
    const nuevoCambio: CambioHistorial = {
      id: this.historialCambios.length + 1,
      fecha: new Date(),
      usuario: 'admin@dicrep.cl', // En producción, obtener del servicio de autenticación
      accion,
      configuracion,
      detalles
    };

    this.historialCambios.unshift(nuevoCambio);
    
    // Mantener solo los últimos 20 cambios
    if (this.historialCambios.length > 20) {
      this.historialCambios = this.historialCambios.slice(0, 20);
    }
  }

  ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.rangoMinimoInput?.nativeElement.focus();
      this.modalAbiertoPrev = true;
    }
    if (!this.modalVisible && this.modalAbiertoPrev) {
      this.modalAbiertoPrev = false;
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDownHandler(event: KeyboardEvent): void {
    if (event.key === 'Escape' && this.modalVisible) {
      this.cerrarModal();
    }
  }
}
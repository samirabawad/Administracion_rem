// src/app/features/gestion-bienes/datos-bancarios/datos-bancarios.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface Comitente {
  comitenteId: number;
  comitenteNombre: string;
  comitenteRut: string;
  comitenteCorreo: string;
  comitenteTelefono: string;
  // Datos bancarios
  bancoCodigo?: string;
  bancoNombre?: string;
  cuentaNumero?: string;
  cuentaTipo?: 'Corriente' | 'Vista' | 'Ahorro';
  cuentaTitular?: string;
  cuentaRutTitular?: string;
  fechaUltimaActualizacion?: Date;
  seleccionado?: boolean;
}

interface Banco {
  codigo: string;
  nombre: string;
}

interface DatosBancarios {
  bancoCodigo: string;
  bancoNombre: string;
  cuentaNumero: string;
  cuentaTipo: 'Corriente' | 'Vista' | 'Ahorro' | '';
  cuentaTitular: string;
  cuentaRutTitular: string;
}

interface ValidacionDatos {
  datosVerificados: boolean;
  observaciones: string;
}

interface FiltrosBusqueda {
  busqueda: string;
  estadoBanco: 'todos' | 'completos' | 'incompletos' | 'sin-datos';
  banco: string;
}

interface HistorialActualizacion {
  id: number;
  fecha: Date;
  comitenteNombre: string;
  usuario: string;
  accion: 'Crear' | 'Actualizar' | 'Verificar';
  detalles: string;
}

@Component({
  selector: 'app-datos-bancarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './datos-bancarios.component.html',
  styleUrls: ['./datos-bancarios.component.scss']
})
export class DatosBancariosComponent implements OnInit, AfterViewChecked {
  @ViewChild('bancoCodigo') bancoCodigoInput!: ElementRef<HTMLSelectElement>;

  // Modal
  modalVisible = false;
  private modalAbiertoPrev = false;
  guardando = false;

  // Datos
  comitentes: Comitente[] = [];
  comitestesFiltrados: Comitente[] = [];
  bancos: Banco[] = [];
  historialReciente: HistorialActualizacion[] = [];

  // Formulario
  comitenteSeleccionado: Comitente | null = null;
  datosBancarios: DatosBancarios = {
    bancoCodigo: '',
    bancoNombre: '',
    cuentaNumero: '',
    cuentaTipo: '',
    cuentaTitular: '',
    cuentaRutTitular: ''
  };
  
  validacionDatos: ValidacionDatos = {
    datosVerificados: false,
    observaciones: ''
  };

  // Filtros
  filtros: FiltrosBusqueda = {
    busqueda: '',
    estadoBanco: 'todos',
    banco: ''
  };

  // Mock de bienes por comitente (para mostrar cantidad de bienes activos)
  private bienesPorComitente: { [key: number]: number } = {
    1: 3,
    2: 5,
    3: 2,
    4: 1,
    5: 4,
    6: 0,
    7: 2,
    8: 1
  };

  ngOnInit(): void {
    this.cargarBancos();
    this.cargarComitentes();
    this.cargarHistorialReciente();
    this.aplicarFiltros();
  }

  private cargarBancos(): void {
    this.bancos = [
      { codigo: 'BCI', nombre: 'Banco de Crédito e Inversiones' },
      { codigo: 'CHILE', nombre: 'Banco de Chile' },
      { codigo: 'ESTADO', nombre: 'BancoEstado' },
      { codigo: 'SANTANDER', nombre: 'Banco Santander Chile' },
      { codigo: 'ITAU', nombre: 'Banco Itaú Chile' },
      { codigo: 'SCOTIABANK', nombre: 'Scotiabank Chile' },
      { codigo: 'BBVA', nombre: 'BBVA Chile' },
      { codigo: 'SECURITY', nombre: 'Banco Security' },
      { codigo: 'FALABELLA', nombre: 'Banco Falabella' },
      { codigo: 'RIPLEY', nombre: 'Banco Ripley' },
      { codigo: 'CONSORCIO', nombre: 'Banco Consorcio' },
      { codigo: 'INTERNACIONAL', nombre: 'Banco Internacional' }
    ];
  }

  private cargarComitentes(): void {
    this.comitentes = [
      {
        comitenteId: 1,
        comitenteNombre: 'Juan Pérez Soto',
        comitenteRut: '12.345.678-9',
        comitenteCorreo: 'juan.perez@email.com',
        comitenteTelefono: '+56 9 8765 4321',
        bancoCodigo: 'BCI',
        bancoNombre: 'Banco de Crédito e Inversiones',
        cuentaNumero: '12345678-9',
        cuentaTipo: 'Corriente',
        cuentaTitular: 'Juan Pérez Soto',
        cuentaRutTitular: '12.345.678-9',
        fechaUltimaActualizacion: new Date('2025-01-15T14:30:00'),
        seleccionado: false
      },
      {
        comitenteId: 2,
        comitenteNombre: 'María González Díaz',
        comitenteRut: '15.678.901-2',
        comitenteCorreo: 'maria.gonzalez@email.com',
        comitenteTelefono: '+56 2 2345 6789',
        bancoCodigo: 'CHILE',
        bancoNombre: 'Banco de Chile',
        cuentaNumero: '98765432-1',
        cuentaTipo: 'Vista',
        cuentaTitular: 'María González Díaz',
        cuentaRutTitular: '15.678.901-2',
        fechaUltimaActualizacion: new Date('2025-01-18T09:15:00'),
        seleccionado: false
      },
      {
        comitenteId: 3,
        comitenteNombre: 'Carlos Rodríguez Morales',
        comitenteRut: '18.234.567-8',
        comitenteCorreo: 'carlos.rodriguez@email.com',
        comitenteTelefono: '+56 9 1234 5678',
        bancoCodigo: 'ESTADO',
        bancoNombre: 'BancoEstado',
        cuentaNumero: '55666777-8',
        cuentaTipo: 'Ahorro',
        // Faltan datos del titular (datos incompletos)
        fechaUltimaActualizacion: new Date('2025-01-10T16:45:00'),
        seleccionado: false
      },
      {
        comitenteId: 4,
        comitenteNombre: 'Ana Silva Torres',
        comitenteRut: '20.111.222-3',
        comitenteCorreo: 'ana.silva@email.com',
        comitenteTelefono: '+56 9 9876 5432',
        bancoCodigo: 'SANTANDER',
        bancoNombre: 'Banco Santander Chile',
        cuentaNumero: '11223344-5',
        cuentaTipo: 'Corriente',
        cuentaTitular: 'Ana Silva Torres',
        cuentaRutTitular: '20.111.222-3',
        fechaUltimaActualizacion: new Date('2025-01-20T11:20:00'),
        seleccionado: false
      },
      {
        comitenteId: 5,
        comitenteNombre: 'Luis Hernández Vega',
        comitenteRut: '16.789.012-3',
        comitenteCorreo: 'luis.hernandez@email.com',
        comitenteTelefono: '+56 2 3456 7890',
        // Sin datos bancarios
        seleccionado: false
      },
      {
        comitenteId: 6,
        comitenteNombre: 'Patricia Moreno López',
        comitenteRut: '19.456.789-0',
        comitenteCorreo: 'patricia.moreno@email.com',
        comitenteTelefono: '+56 9 5555 6666',
        bancoCodigo: 'ITAU',
        bancoNombre: 'Banco Itaú Chile',
        cuentaNumero: '77889900-1',
        // Faltan tipo de cuenta y datos del titular (datos incompletos)
        fechaUltimaActualizacion: new Date('2024-12-15T13:30:00'),
        seleccionado: false
      },
      {
        comitenteId: 7,
        comitenteNombre: 'Roberto Castillo Fuentes',
        comitenteRut: '22.333.444-5',
        comitenteCorreo: 'roberto.castillo@email.com',
        comitenteTelefono: '+56 9 7777 8888',
        // Sin datos bancarios
        seleccionado: false
      },
      {
        comitenteId: 8,
        comitenteNombre: 'Carmen Ruiz Santander',
        comitenteRut: '17.555.666-7',
        comitenteCorreo: 'carmen.ruiz@email.com',
        comitenteTelefono: '+56 2 4567 8901',
        bancoCodigo: 'SECURITY',
        bancoNombre: 'Banco Security',
        cuentaNumero: '33445566-7',
        cuentaTipo: 'Vista',
        cuentaTitular: 'Carmen Ruiz Santander',
        cuentaRutTitular: '17.555.666-7',
        fechaUltimaActualizacion: new Date('2025-01-22T08:45:00'),
        seleccionado: false
      }
    ];
  }

  private cargarHistorialReciente(): void {
    this.historialReciente = [
      {
        id: 1,
        fecha: new Date('2025-01-22T08:45:00'),
        comitenteNombre: 'Carmen Ruiz Santander',
        usuario: 'admin@dicrep.cl',
        accion: 'Actualizar',
        detalles: 'Actualización de datos bancarios - Banco Security'
      },
      {
        id: 2,
        fecha: new Date('2025-01-20T11:20:00'),
        comitenteNombre: 'Ana Silva Torres',
        usuario: 'operador@dicrep.cl',
        accion: 'Verificar',
        detalles: 'Verificación telefónica de datos bancarios'
      },
      {
        id: 3,
        fecha: new Date('2025-01-18T09:15:00'),
        comitenteNombre: 'María González Díaz',
        usuario: 'supervisor@dicrep.cl',
        accion: 'Actualizar',
        detalles: 'Cambio de cuenta corriente a cuenta vista'
      },
      {
        id: 4,
        fecha: new Date('2025-01-15T14:30:00'),
        comitenteNombre: 'Juan Pérez Soto',
        usuario: 'admin@dicrep.cl',
        accion: 'Crear',
        detalles: 'Ingreso inicial de datos bancarios'
      }
    ];
  }

  aplicarFiltros(): void {
    this.comitestesFiltrados = this.comitentes.filter(comitente => {
      let cumpleFiltro = true;

      // Filtro por búsqueda (nombre o RUT)
      if (this.filtros.busqueda.trim()) {
        const busqueda = this.filtros.busqueda.toLowerCase().trim();
        const nombreCoincide = comitente.comitenteNombre.toLowerCase().includes(busqueda);
        const rutCoincide = comitente.comitenteRut.toLowerCase().includes(busqueda);
        cumpleFiltro = cumpleFiltro && (nombreCoincide || rutCoincide);
      }

      // Filtro por estado de datos bancarios
      if (this.filtros.estadoBanco !== 'todos') {
        const estadoComitente = this.obtenerEstadoDatos(comitente);
        cumpleFiltro = cumpleFiltro && estadoComitente === this.filtros.estadoBanco;
      }

      // Filtro por banco
      if (this.filtros.banco) {
        cumpleFiltro = cumpleFiltro && comitente.bancoCodigo === this.filtros.banco;
      }

      return cumpleFiltro;
    });
  }

  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      estadoBanco: 'todos',
      banco: ''
    };
    this.aplicarFiltros();
  }

  obtenerEstadoDatos(comitente: Comitente): 'completos' | 'incompletos' | 'sin-datos' {
    if (!comitente.bancoCodigo) {
      return 'sin-datos';
    }

    const camposObligatorios = [
      comitente.bancoCodigo,
      comitente.cuentaNumero,
      comitente.cuentaTipo,
      comitente.cuentaTitular,
      comitente.cuentaRutTitular
    ];

    const todoCompleto = camposObligatorios.every(campo => campo && campo.trim());
    return todoCompleto ? 'completos' : 'incompletos';
  }

  obtenerTextoEstado(comitente: Comitente): string {
    const estado = this.obtenerEstadoDatos(comitente);
    const estados = {
      'completos': 'Completos',
      'incompletos': 'Incompletos',
      'sin-datos': 'Sin Datos'
    };
    return estados[estado];
  }

  contarPorEstado(estado: 'completos' | 'incompletos' | 'sin-datos'): number {
    return this.comitestesFiltrados.filter(c => this.obtenerEstadoDatos(c) === estado).length;
  }

  contarBienesActivos(comitenteId: number): number {
    return this.bienesPorComitente[comitenteId] || 0;
  }

  editarDatosBancarios(comitente: Comitente): void {
    this.comitenteSeleccionado = comitente;
    
    // Cargar datos existentes
    this.datosBancarios = {
      bancoCodigo: comitente.bancoCodigo || '',
      bancoNombre: comitente.bancoNombre || '',
      cuentaNumero: comitente.cuentaNumero || '',
      cuentaTipo: comitente.cuentaTipo || '',
      cuentaTitular: comitente.cuentaTitular || '',
      cuentaRutTitular: comitente.cuentaRutTitular || ''
    };

    this.validacionDatos = {
      datosVerificados: false,
      observaciones: ''
    };

    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.comitenteSeleccionado = null;
    this.datosBancarios = {
      bancoCodigo: '',
      bancoNombre: '',
      cuentaNumero: '',
      cuentaTipo: '',
      cuentaTitular: '',
      cuentaRutTitular: ''
    };
    this.validacionDatos = {
      datosVerificados: false,
      observaciones: ''
    };
    document.body.style.overflow = '';
  }

  onBancoChange(): void {
    const bancoSeleccionado = this.bancos.find(b => b.codigo === this.datosBancarios.bancoCodigo);
    this.datosBancarios.bancoNombre = bancoSeleccionado?.nombre || '';
  }

  guardarDatosBancarios(): void {
    if (!this.comitenteSeleccionado || !this.validarFormulario()) {
      return;
    }

    this.guardando = true;

    // Simular guardado
    setTimeout(() => {
      if (this.comitenteSeleccionado) {
        // Actualizar los datos del comitente
        this.comitenteSeleccionado.bancoCodigo = this.datosBancarios.bancoCodigo;
        this.comitenteSeleccionado.bancoNombre = this.datosBancarios.bancoNombre;
        this.comitenteSeleccionado.cuentaNumero = this.datosBancarios.cuentaNumero;
        this.comitenteSeleccionado.cuentaTipo = this.datosBancarios.cuentaTipo as 'Corriente' | 'Vista' | 'Ahorro';
        this.comitenteSeleccionado.cuentaTitular = this.datosBancarios.cuentaTitular;
        this.comitenteSeleccionado.cuentaRutTitular = this.datosBancarios.cuentaRutTitular;
        this.comitenteSeleccionado.fechaUltimaActualizacion = new Date();

        // Agregar al historial
        const nuevaActualizacion: HistorialActualizacion = {
          id: this.historialReciente.length + 1,
          fecha: new Date(),
          comitenteNombre: this.comitenteSeleccionado.comitenteNombre,
          usuario: 'admin@dicrep.cl',
          accion: 'Actualizar',
          detalles: `Actualización de datos bancarios - ${this.datosBancarios.bancoNombre}`
        };

        this.historialReciente.unshift(nuevaActualizacion);

        // Mantener solo los últimos 20 registros
        if (this.historialReciente.length > 20) {
          this.historialReciente = this.historialReciente.slice(0, 20);
        }

        this.aplicarFiltros();
        this.guardando = false;

        Swal.fire({
          title: '¡Datos actualizados!',
          text: `Los datos bancarios de ${this.comitenteSeleccionado.comitenteNombre} han sido actualizados correctamente`,
          icon: 'success'
        });

        this.cerrarModal();
      }
    }, 1500);
  }

  private validarFormulario(): boolean {
    const camposRequeridos = [
      this.datosBancarios.bancoCodigo,
      this.datosBancarios.cuentaNumero,
      this.datosBancarios.cuentaTipo,
      this.datosBancarios.cuentaTitular,
      this.datosBancarios.cuentaRutTitular
    ];

    if (!camposRequeridos.every(campo => campo && campo.trim())) {
      return false;
    }

    if (!this.validacionDatos.datosVerificados) {
      return false;
    }

    return true;
  }

  verHistorial(comitente: Comitente): void {
    const actualizacionesComitente = this.historialReciente.filter(
      h => h.comitenteNombre === comitente.comitenteNombre
    );

    if (actualizacionesComitente.length === 0) {
      Swal.fire({
        title: 'Sin historial',
        text: `No hay actualizaciones registradas para ${comitente.comitenteNombre}`,
        icon: 'info'
      });
      return;
    }

    const historialHtml = actualizacionesComitente.map(h => 
      `<div class="text-start mb-2">
        <strong>${h.fecha.toLocaleDateString()} ${h.fecha.toLocaleTimeString()}</strong><br>
        <span class="badge bg-primary">${h.accion}</span> por ${h.usuario}<br>
        <small>${h.detalles}</small>
      </div>`
    ).join('<hr>');

    Swal.fire({
      title: `Historial - ${comitente.comitenteNombre}`,
      html: historialHtml,
      width: '600px',
      confirmButtonText: 'Cerrar'
    });
  }

  toggleSeleccionarTodos(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.comitestesFiltrados.forEach(comitente => comitente.seleccionado = seleccionado);
  }

  todoSeleccionado(): boolean {
    return this.comitestesFiltrados.length > 0 && 
           this.comitestesFiltrados.every(comitente => comitente.seleccionado);
  }

  haySeleccionados(): boolean {
    return this.comitestesFiltrados.some(comitente => comitente.seleccionado);
  }

  contarSeleccionados(): number {
    return this.comitestesFiltrados.filter(comitente => comitente.seleccionado).length;
  }

  exportarSeleccionados(): void {
    const seleccionados = this.comitestesFiltrados.filter(c => c.seleccionado);
    
    Swal.fire({
      title: '¿Exportar datos bancarios?',
      text: `Se exportarán los datos bancarios de ${seleccionados.length} comitentes`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, exportar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simular exportación
        Swal.fire({
          title: 'Generando archivo...',
          html: 'Por favor espere mientras se genera el archivo Excel',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(() => {
          Swal.fire({
            title: '¡Exportación exitosa!',
            text: `Se han exportado ${seleccionados.length} registros`,
            icon: 'success'
          });
        }, 2000);
      }
    });
  }

  enviarRecordatorios(): void {
    const seleccionados = this.comitestesFiltrados.filter(c => 
      c.seleccionado && this.obtenerEstadoDatos(c) !== 'completos'
    );

    if (seleccionados.length === 0) {
      Swal.fire({
        title: 'Sin comitentes para notificar',
        text: 'Seleccione comitentes con datos bancarios incompletos o faltantes',
        icon: 'info'
      });
      return;
    }

    Swal.fire({
      title: `¿Enviar recordatorios?`,
      text: `Se enviarán recordatorios por email a ${seleccionados.length} comitentes`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, enviar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simular envío
        Swal.fire({
          title: 'Enviando recordatorios...',
          html: 'Por favor espere',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(() => {
          Swal.fire({
            title: '¡Recordatorios enviados!',
            text: `Se enviaron ${seleccionados.length} recordatorios por email`,
            icon: 'success'
          });
        }, 1500);
      }
    });
  }

  generarReporte(): void {
    const seleccionados = this.comitestesFiltrados.filter(c => c.seleccionado);
    
    Swal.fire({
      title: '¿Generar reporte?',
      text: `Se generará un reporte detallado de ${seleccionados.length} comitentes`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Simular generación de reporte
        Swal.fire({
          title: 'Generando reporte...',
          html: 'Por favor espere mientras se genera el reporte PDF',
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          }
        });

        setTimeout(() => {
          Swal.fire({
            title: '¡Reporte generado!',
            text: 'El reporte ha sido generado correctamente',
            icon: 'success'
          });
        }, 2500);
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.bancoCodigoInput?.nativeElement.focus();
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
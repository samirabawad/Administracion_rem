// src/app/features/Usuarios/Empleados/Empleados/empleados.component.ts
import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, HostListener, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
import { EmpleadosService } from '../empleados.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Subject, takeUntil } from 'rxjs';

interface EmpleadoMejorado {
  empId: number;
  empUsuario: string;
  empRut: string;
  empRutDig?: string;
  empNombre: string;
  empSegundoNombre?: string;
  empApellido: string;
  empSegundoApellido?: string;
  empCorreo: string;
  empTelefono?: string;
  empAnexo?: string;
  empCargo?: string;
  empActivo: boolean;
  empFechaLog?: Date;
  empFechaExp?: Date;
  perfilId: number;
  perfilNombre?: string;
  sucursalId: number;
  sucursalNombre?: string;
  authMethod: number; // 0: Local, 1: LDAP, 2: Clave Única
  password?: string;
  nivelAcceso: number;
  forzarCambioPassword?: boolean;
  seleccionado?: boolean;
  /*
  // Propiedades adicionales para compatibilidad
  usuarioCreacion?: string;
  fechaCreacion?: Date;
  */
}

interface Perfil {
  perfilId: number;
  perfilNombre: string;
  perfilDescripcion: string;
}

interface Sucursal {
  sucursalId: number;
  sucursalNombre: string;
  sucursalCiudad: string;
}

interface Permiso {
  permisoId: number;
  permisoNombre: string;
  permisoDescripcion: string;
  asignado: boolean;
}

interface FiltrosEmpleados {
  busqueda: string;
  estado: 'todos' | 'activos' | 'inactivos';
  perfil: string;
  sucursal: string;
}

@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrls: ['./empleados.component.scss']
})

//export class EmpleadosComponent implements OnInit, AfterViewChecked, OnDestroy
export class EmpleadosComponent implements OnInit, AfterViewChecked, OnDestroy {
  @ViewChild('empUsuario') empUsuarioInput!: ElementRef<HTMLInputElement>;

    ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /*
  //Lo comento porque esta duplicado, vere si funciona asi primero:
    ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.empUsuarioInput?.nativeElement.focus();
      this.modalAbiertoPrev = true;
    }
    if (!this.modalVisible && this.modalAbiertoPrev) {
      this.modalAbiertoPrev = false;
    }
  }
  
  */
  private destroy$ = new Subject<void>();

  // Modal
  modalVisible = false;
  private modalAbiertoPrev = false;
  modoEdicion = false;
  empleadoEditandoId: number | null = null;
  guardando = false;
  pestanaActiva: 'datos' | 'acceso' | 'permisos' = 'datos';

  // Formulario
  nuevoEmpleado: Partial<EmpleadoMejorado> = {
    empActivo: true,
    authMethod: 0,
    nivelAcceso: 1,
    forzarCambioPassword: true
  };
  
  confirmarPassword = '';
  mostrarPassword = false;
  fechaExpiracionStr = '';

  // Datos
  empleados: EmpleadoMejorado[] = [];
  empleadosFiltrados: EmpleadoMejorado[] = [];
  perfiles: Perfil[] = [];
  sucursales: Sucursal[] = [];
  permisosDisponibles: Permiso[] = [];

  // Filtros
  filtros: FiltrosEmpleados = {
    busqueda: '',
    estado: 'todos',
    perfil: '',
    sucursal: ''
  };

  constructor(
    private empleadosService: EmpleadosService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.cargarDatos();
    this.aplicarFiltros();
  }
  
  // Loading states
  cargandoDatos = false;

  private cargarDatos(): void {
    this.cargandoDatos = true;

    // Verificar si el servicio está disponible
    if (!this.empleadosService) {
      console.warn('EmpleadosService no está disponible, usando datos mock');
      this.cargarDatosAuxiliares();
      return;
    }

    // Cargar empleados
    this.empleadosService.getEmpleados()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (empleados) => {
          this.empleados = empleados.map((emp: any): EmpleadoMejorado => ({
            ...emp,
            seleccionado: false,
            empFechaLog: emp.empFechaLog ? new Date(emp.empFechaLog) : undefined,
            empFechaExp: emp.empFechaExp ? new Date(emp.empFechaExp) : undefined
          }));
          this.aplicarFiltros();
          this.cargandoDatos = false;
        },
        error: (error) => {
          this.cargandoDatos = false;
          console.error('Error cargando empleados:', error);
          
          Swal.fire({
            title: 'Advertencia',
            text: 'No se pudieron cargar los empleados desde el servidor. Mostrando datos de ejemplo.',
            icon: 'warning'
          });
        }
      });

    // Cargar datos auxiliares
    this.cargarDatosAuxiliares();
  }


  private cargarDatosAuxiliares(): void {
    if (!this.empleadosService) {
      return;
    }

    // Cargar perfiles
    this.empleadosService.getPerfiles()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (perfiles) => {
          this.perfiles = perfiles;
        },
        error: (error) => {
          console.error('Error cargando perfiles:', error);
        }
      });

    // Cargar sucursales
    this.empleadosService.getSucursales()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (sucursales) => {
          this.sucursales = sucursales;
        },
        error: (error) => {
          console.error('Error cargando sucursales:', error);
        }
      });

    // Cargar permisos
    this.empleadosService.getPermisos()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (permisos) => {
          this.permisosDisponibles = permisos.map(p => ({...p, asignado: false}));
        },
        error: (error) => {
          console.error('Error cargando permisos:', error);
        }
      });
  }


  get perfilSeleccionado(): Perfil | undefined {
    return this.perfiles.find(p => p.perfilId === this.nuevoEmpleado.perfilId);
  }


  aplicarFiltros(): void {
    this.empleadosFiltrados = this.empleados.filter(empleado => {
      let cumpleFiltro = true;

      // Filtro por búsqueda
      if (this.filtros.busqueda.trim()) {
        const busqueda = this.filtros.busqueda.toLowerCase().trim();
        const coincidencias = [
          empleado.empNombre.toLowerCase(),
          empleado.empApellido.toLowerCase(),
          empleado.empUsuario.toLowerCase(),
          empleado.empCorreo.toLowerCase(),
          empleado.empRut.toLowerCase()
        ];
        cumpleFiltro = cumpleFiltro && coincidencias.some(campo => campo.includes(busqueda));
      }

      // Filtro por estado
      if (this.filtros.estado !== 'todos') {
        cumpleFiltro = cumpleFiltro && (
          (this.filtros.estado === 'activos' && empleado.empActivo) ||
          (this.filtros.estado === 'inactivos' && !empleado.empActivo)
        );
      }

      // Filtro por perfil
      if (this.filtros.perfil) {
        cumpleFiltro = cumpleFiltro && empleado.perfilId.toString() === this.filtros.perfil;
      }

      // Filtro por sucursal
      if (this.filtros.sucursal) {
        cumpleFiltro = cumpleFiltro && empleado.sucursalId.toString() === this.filtros.sucursal;
      }

      return cumpleFiltro;
    });
  }



  limpiarFiltros(): void {
    this.filtros = {
      busqueda: '',
      estado: 'todos',
      perfil: '',
      sucursal: ''
    };
    this.aplicarFiltros();
  }


  contarPorEstado(estado: 'activos' | 'inactivos'): number {
    return this.empleadosFiltrados.filter(e => 
      estado === 'activos' ? e.empActivo : !e.empActivo
    ).length;
  }


  contarProximosVencer(): number {
    return this.empleadosFiltrados.filter(e => 
      e.empFechaExp && this.estaProximoVencer(e.empFechaExp)
    ).length;
  }


  estaProximoVencer(fechaExp: Date): boolean {
    const hoy = new Date();
    const diasRestantes = Math.ceil((fechaExp.getTime() - hoy.getTime()) / (1000 * 60 * 60 * 24));
    return diasRestantes <= 30 && diasRestantes > 0;
  }


  obtenerTipoAuth(authMethod: number): string {
    const tipos = {
      0: 'Contraseña Local',
      1: 'LDAP/AD',
      2: 'Clave Única'
    };
    return tipos[authMethod as keyof typeof tipos] || 'Desconocido';
  }


  abrirModal(): void {
    this.modalVisible = true;
    this.modoEdicion = false;
    this.empleadoEditandoId = null;
    this.pestanaActiva = 'datos';
    this.nuevoEmpleado = {
      empActivo: true,
      authMethod: 0,
      nivelAcceso: 1,
      forzarCambioPassword: true
    };
    this.confirmarPassword = '';
    this.fechaExpiracionStr = '';
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoEmpleado = {};
    this.confirmarPassword = '';
    this.fechaExpiracionStr = '';
    this.modoEdicion = false;
    this.empleadoEditandoId = null;
    document.body.style.overflow = '';
  }


  editarEmpleado(empleado: EmpleadoMejorado): void {
    this.modoEdicion = true;
    this.empleadoEditandoId = empleado.empId;
    this.nuevoEmpleado = { ...empleado };
    this.fechaExpiracionStr = empleado.empFechaExp ? 
      empleado.empFechaExp.toISOString().split('T')[0] : '';
    this.modalVisible = true;
    this.pestanaActiva = 'datos';
    document.body.style.overflow = 'hidden';
  }

  generarUsuarioAutomatico(): void {
    if (this.nuevoEmpleado.empNombre && this.nuevoEmpleado.empApellido) {
      const nombre = this.nuevoEmpleado.empNombre.toLowerCase();
      const apellido = this.nuevoEmpleado.empApellido.toLowerCase();
      this.nuevoEmpleado.empUsuario = `${nombre.charAt(0)}${apellido}`;
    }
  }



  guardarEmpleado(): void {
    if (!this.validarFormulario()) {
      return;
    }

    this.guardando = true;

    // Procesar fecha de expiración
    if (this.fechaExpiracionStr) {
      this.nuevoEmpleado.empFechaExp = new Date(this.fechaExpiracionStr);
    }

    // Simular guardado
    setTimeout(() => {
      const empleadoAGuardar: EmpleadoMejorado = {
        ...this.nuevoEmpleado,
        empId: this.empleadoEditandoId ?? this.empleados.length + 1,
        perfilNombre: this.perfiles.find(p => p.perfilId === this.nuevoEmpleado.perfilId)?.perfilNombre,
        sucursalNombre: this.sucursales.find(s => s.sucursalId === this.nuevoEmpleado.sucursalId)?.sucursalNombre
      } as EmpleadoMejorado;

      if (this.modoEdicion && this.empleadoEditandoId !== null) {
        const index = this.empleados.findIndex(e => e.empId === this.empleadoEditandoId);
        if (index !== -1) {
          this.empleados[index] = { ...empleadoAGuardar, seleccionado: false };
        }
      } else {
        this.empleados.push({ ...empleadoAGuardar, seleccionado: false });
      }

      this.aplicarFiltros();
      this.guardando = false;

      Swal.fire({
        title: this.modoEdicion ? '¡Empleado actualizado!' : '¡Empleado creado!',
        text: `${empleadoAGuardar.empNombre} ${empleadoAGuardar.empApellido} ha sido ${this.modoEdicion ? 'actualizado' : 'creado'} correctamente`,
        icon: 'success'
      });

      this.cerrarModal();
    }, 1500);
  }

  private validarFormulario(): boolean {
    // Validaciones básicas
    if (!this.nuevoEmpleado.empRut || !this.nuevoEmpleado.empNombre || 
        !this.nuevoEmpleado.empApellido || !this.nuevoEmpleado.empCorreo || 
        !this.nuevoEmpleado.empUsuario || !this.nuevoEmpleado.perfilId || 
        !this.nuevoEmpleado.sucursalId) {
      return false;
    }

    // Validación de contraseñas
    if (this.nuevoEmpleado.authMethod === 0) {
      if (!this.nuevoEmpleado.password || this.nuevoEmpleado.password !== this.confirmarPassword) {
        return false;
      }
    }

    return true;
  }

  

  toggleEstadoEmpleado(empleado: EmpleadoMejorado): void {
    const accion = empleado.empActivo ? 'desactivar' : 'activar';
    
    Swal.fire({
      title: `¿${accion.charAt(0).toUpperCase() + accion.slice(1)} empleado?`,
      text: `Se va a ${accion} a ${empleado.empNombre} ${empleado.empApellido}`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: `Sí, ${accion}`,
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        empleado.empActivo = !empleado.empActivo;
        
        Swal.fire({
          title: `¡Empleado ${accion}do!`,
          text: `${empleado.empNombre} ${empleado.empApellido} ha sido ${accion}do correctamente`,
          icon: 'success'
        });

        this.aplicarFiltros();
      }
    });
  }

  verHistorial(empleado: EmpleadoMejorado): void {
    Swal.fire({
      title: `Historial - ${empleado.empNombre} ${empleado.empApellido}`,
      html: `
        <div class="text-start">
          <p><strong>Usuario:</strong> ${empleado.empUsuario}</p>
          <p><strong>Último acceso:</strong> ${empleado.empFechaLog ? empleado.empFechaLog.toLocaleString() : 'Nunca'}</p>
          <p><strong>Estado:</strong> ${empleado.empActivo ? 'Activo' : 'Inactivo'}</p>
          <p><strong>Perfil:</strong> ${empleado.perfilNombre || 'Sin perfil'}</p>
          <p><strong>Sucursal:</strong> ${empleado.sucursalNombre || 'Sin sucursal'}</p>
          ${empleado.empFechaExp ? `<p><strong>Fecha expiración:</strong> ${empleado.empFechaExp.toLocaleDateString()}</p>` : ''}
        </div>
      `,
      width: '500px',
      confirmButtonText: 'Cerrar'
    });
  }

  toggleSeleccionarTodos(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.empleadosFiltrados.forEach(empleado => empleado.seleccionado = seleccionado);
  }

  todoSeleccionado(): boolean {
    return this.empleadosFiltrados.length > 0 && 
           this.empleadosFiltrados.every(empleado => empleado.seleccionado);
  }

  haySeleccionados(): boolean {
    return this.empleadosFiltrados.some(empleado => empleado.seleccionado);
  }

  contarSeleccionados(): number {
    return this.empleadosFiltrados.filter(empleado => empleado.seleccionado).length;
  }

  activarSeleccionados(): void {
    const seleccionados = this.empleadosFiltrados.filter(e => e.seleccionado && !e.empActivo);
    
    if (seleccionados.length === 0) {
      Swal.fire('Sin empleados para activar', 'No hay empleados inactivos seleccionados', 'info');
      return;
    }

    Swal.fire({
      title: `¿Activar ${seleccionados.length} empleados?`,
      text: 'Se activarán todos los empleados seleccionados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, activar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionados.forEach(e => {
          e.empActivo = true;
          e.seleccionado = false;
        });

        Swal.fire('¡Empleados activados!', `Se activaron ${seleccionados.length} empleados`, 'success');
        this.aplicarFiltros();
      }
    });
  }

  desactivarSeleccionados(): void {
    const seleccionados = this.empleadosFiltrados.filter(e => e.seleccionado && e.empActivo);
    
    if (seleccionados.length === 0) {
      Swal.fire('Sin empleados para desactivar', 'No hay empleados activos seleccionados', 'info');
      return;
    }

    Swal.fire({
      title: `¿Desactivar ${seleccionados.length} empleados?`,
      text: 'Se desactivarán todos los empleados seleccionados',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionados.forEach(e => {
          e.empActivo = false;
          e.seleccionado = false;
        });

        Swal.fire('¡Empleados desactivados!', `Se desactivaron ${seleccionados.length} empleados`, 'success');
        this.aplicarFiltros();
      }
    });
  }

  exportarSeleccionados(): void {
    const seleccionados = this.empleadosFiltrados.filter(e => e.seleccionado);
    
    Swal.fire({
      title: 'Generando exportación...',
      text: `Se exportarán ${seleccionados.length} empleados`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire('¡Exportación completa!', `Se exportaron ${seleccionados.length} empleados`, 'success');
    }, 2000);
  }

  enviarCredenciales(): void {
    const seleccionados = this.empleadosFiltrados.filter(e => e.seleccionado);
    
    Swal.fire({
      title: 'Enviando credenciales...',
      text: `Se enviarán credenciales a ${seleccionados.length} empleados`,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    setTimeout(() => {
      Swal.fire('¡Credenciales enviadas!', `Se enviaron credenciales a ${seleccionados.length} empleados`, 'success');
    }, 2000);
  }

  resetearPasswords(): void {
    const seleccionados = this.empleadosFiltrados.filter(e => e.seleccionado && e.authMethod === 0);
    
    if (seleccionados.length === 0) {
      Swal.fire('Sin empleados con contraseña local', 'Solo se pueden resetear contraseñas de empleados con autenticación local', 'info');
      return;
    }

    Swal.fire({
      title: `¿Resetear ${seleccionados.length} contraseñas?`,
      text: 'Se generarán nuevas contraseñas temporales',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'Sí, resetear',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        seleccionados.forEach(e => {
          e.forzarCambioPassword = true;
          e.seleccionado = false;
        });

        Swal.fire('¡Contraseñas reseteadas!', `Se resetearon ${seleccionados.length} contraseñas`, 'success');
      }
    });
  }

  ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.empUsuarioInput?.nativeElement.focus();
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
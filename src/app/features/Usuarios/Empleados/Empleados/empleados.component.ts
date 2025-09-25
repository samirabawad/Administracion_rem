import {
  Component,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  HostListener,
  OnInit
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

import { EmpleadosService } from '../empleados.service';
import { Empleado } from '../empleados.model';
@Component({
  selector: 'app-empleados',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './empleados.component.html',
  styleUrl: './empleados.component.scss'
})
export class EmpleadosComponent implements OnInit, AfterViewChecked {
  // Modal
  modalVisible = false;
  private modalAbiertoPrev = false;
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

  // Formulario
  nuevoEmpleado: Partial<Empleado> = {
    empActivo: true,
    authMethod: 0
  };

  // Estado
  modoEdicion = false;
  empleadoEditandoId: number | null = null;
  empleados: Empleado[] = [];

  // Filtros
  filtroNombre = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';

  perfiles: { perfilId: number; perfilNombre: string }[] = [];
  sucursales: { sucursalId: number; sucursalNombre: string }[] = [];

  constructor(
    private empleadosService: EmpleadosService
  ) {}

  ngOnInit(): void {
  }

  get empleadosFiltrados(): Empleado[] {
    return this.empleados.filter(empleado => {
      const nombreCompleto = `${empleado.empNombre} ${empleado.empApellido}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(this.filtroNombre.toLowerCase()) ||
        empleado.empUsuario.toLowerCase().includes(this.filtroNombre.toLowerCase());

      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && empleado.empActivo) ||
        (this.filtroEstado === 'inactivos' && !empleado.empActivo);

      return coincideNombre && coincideEstado;
    });
  }

  obtenerEmpleados(): void {
    this.empleadosService.getEmpleados().subscribe({
      next: (empleados) => {
        this.empleados = empleados.map(e => ({ ...e, seleccionada: false }));
      },
      error: (err) => console.error('Error al obtener empleados:', err)
    });
  }

  abrirModal(): void {
    this.modalVisible = true;
    this.nuevoEmpleado = {
      empActivo: true,
      authMethod: 0
    };
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoEmpleado = {};
    this.modoEdicion = false;
    this.empleadoEditandoId = null;
    document.body.style.overflow = '';
  }

  guardarEmpleado(): void {
    if (this.nuevoEmpleado.empUsuario?.trim() && this.nuevoEmpleado.empNombre?.trim() && this.nuevoEmpleado.empCorreo?.trim()) {
      const empleadoAGuardar: Empleado = {
        ...this.nuevoEmpleado,
        empId: this.empleadoEditandoId ?? 0
      } as Empleado;

      if (this.modoEdicion && this.empleadoEditandoId !== null) {
        this.empleadosService.actualizarEmpleado(empleadoAGuardar).subscribe({
          next: (actualizado) => {
            const index = this.empleados.findIndex(e => e.empId === actualizado.empId);
            if (index !== -1) {
              this.empleados[index] = { ...actualizado, seleccionada: false };
            }
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar empleado:', err)
        });
      } else {
        this.empleadosService.agregarEmpleado(empleadoAGuardar).subscribe({
          next: (creado) => {
            this.empleados.push({ ...creado, seleccionada: false });
            this.cerrarModal();
          },
          error: (err) => console.error('Error al guardar empleado:', err)
        });
      }
    }
  }

  editarEmpleado(empleado: Empleado): void {
    this.modoEdicion = true;
    this.empleadoEditandoId = empleado.empId;
    this.nuevoEmpleado = { ...empleado };
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  eliminarEmpleado(empId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el empleado de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.empleadosService.eliminarEmpleado(empId).subscribe({
          next: () => {
            this.empleados = this.empleados.filter(e => e.empId !== empId);
            Swal.fire('¡Eliminado!', 'El empleado ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar el empleado:', err);
            Swal.fire('Error', 'Ocurrió un problema al eliminar el empleado.', 'error');
          }
        });
      }
    });
  }

  obtenerNombrePerfil(perfilId: number): string {
    const perfil = this.perfiles.find(p => p.perfilId === perfilId);
    return perfil ? perfil.perfilNombre : '—';
  }

  obtenerNombreSucursal(sucursalId: number): string {
    const sucursal = this.sucursales.find(s => s.sucursalId === sucursalId);
    return sucursal ? sucursal.sucursalNombre : '—';
  }

  toggleSeleccionarTodo(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.empleados.forEach(e => e.seleccionada = seleccionado);
  }

  ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.nombreInput?.nativeElement.focus();
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

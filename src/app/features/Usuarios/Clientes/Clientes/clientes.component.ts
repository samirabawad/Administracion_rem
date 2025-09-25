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
import { ClientesService } from '../clientes.service';
import { ComunaService } from '../../../Ubicaciones/Comunas/comuna.service';
import { Cliente } from '../clientes.model';

@Component({
  selector: 'app-clientes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './clientes.component.html',
  styleUrl: './clientes.component.scss'
})
export class ClientesComponent implements OnInit, AfterViewChecked {
  modalVisible = false;
  private modalAbiertoPrev = false;

  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

  nuevoCliente: Partial<Cliente> = {};
  modoEdicion = false;
  clienteEditandoId: number | null = null;
  clientes: Cliente[] = [];

  filtroNombre = '';
  filtroEstado: 'todos' | 'empresa' | 'persona' = 'todos';

  generos: { generoId: number, generoDescr: string }[] = [];
  comunas: { comunaId: number, comunaNombre: string }[] = [];


    constructor(
      private clientesService: ClientesService,
      private comunasService: ComunaService
    ) {}

    ngOnInit(): void {
      this.obtenerClientes();

      this.comunasService.getComunas().subscribe({
        next: data => this.comunas = data,
        error: err => console.error('Error al cargar comunas:', err)
      });
    }

  get clientesFiltrados(): Cliente[] {
    return this.clientes.filter(cliente => {
      const nombreCompleto = `${cliente.clienteNombre} ${cliente.clienteApellido}`.toLowerCase();
      const coincideNombre = nombreCompleto.includes(this.filtroNombre.toLowerCase());
      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'empresa' && cliente.clienteEsEmpresa) ||
        (this.filtroEstado === 'persona' && !cliente.clienteEsEmpresa);
      return coincideNombre && coincideEstado;
    });
  }

  obtenerClientes(): void {
    this.clientesService.getClientes().subscribe({
      next: (clientes) => {
        this.clientes = clientes.map(c => ({ ...c, seleccionada: false }));
      },
      error: (err) => console.error('Error al obtener clientes:', err)
    });
  }

  abrirModal(): void {
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevoCliente = {};
    this.modoEdicion = false;
    this.clienteEditandoId = null;
    document.body.style.overflow = '';
  }

  guardarCliente(): void {
    if (this.nuevoCliente.clienteNombre?.trim() && this.nuevoCliente.clienteCorreo) {
      const clienteAGuardar: Cliente = {
        ...this.nuevoCliente,
        clienteId: this.clienteEditandoId ?? 0
      } as Cliente;

      if (this.modoEdicion && this.clienteEditandoId !== null) {
        this.clientesService.actualizarCliente(clienteAGuardar).subscribe({
          next: (actualizado) => {
            const index = this.clientes.findIndex(c => c.clienteId === actualizado.clienteId);
            if (index !== -1) {
              this.clientes[index] = { ...actualizado, seleccionada: false };
            }
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar cliente:', err)
        });
      } else {
        this.clientesService.agregarCliente(clienteAGuardar).subscribe({
          next: (creado) => {
            this.clientes.push({ ...creado, seleccionada: false });
            this.cerrarModal();
          },
          error: (err) => console.error('Error al guardar cliente:', err)
        });
      }
    }
  }

  editarCliente(cliente: Cliente): void {
    this.modoEdicion = true;
    this.clienteEditandoId = cliente.clienteId;
    this.nuevoCliente = { ...cliente };
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  eliminarCliente(clienteId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el cliente de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.clientesService.eliminarCliente(clienteId).subscribe({
          next: () => {
            this.clientes = this.clientes.filter(c => c.clienteId !== clienteId);
            Swal.fire('¡Eliminado!', 'El cliente ha sido eliminado.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar el cliente:', err);
            Swal.fire('Error', 'Ocurrió un problema al eliminar el cliente.', 'error');
          }
        });
      }
    });
  }

  obtenerNombreComuna(comunaId: number): string {
  const comuna = this.comunas.find(c => c.comunaId === comunaId);
  return comuna ? comuna.comunaNombre : 'Desconocida';
}

  obtenerNombreGenero(generoId: number): string {
    const genero = this.generos.find(g => g.generoId === generoId);
    return genero ? genero.generoDescr : 'Desconocido';
  }


  toggleSeleccionarTodo(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.clientes.forEach(c => c.seleccionada = seleccionado);
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

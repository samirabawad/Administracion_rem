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

import { ComunaService } from '../comuna.service';
import { ProvinciaService } from '../../Provincias/provincia.service';
import { Comuna } from '../comuna.model';
import { Provincia } from '../../Provincias/provincia.model';

@Component({
  selector: 'app-comuna',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comuna.component.html',
  styleUrl: './comuna.component.scss'
})
export class ComunaComponent implements OnInit, AfterViewChecked {
  // Modal
  modalVisible = false;
  private modalAbiertoPrev = false;
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

  // Formulario
  nuevaComunaNombre = '';
  nuevaComunaProvincia: number | null = null;
  nuevaComunaActivo: boolean | null = null;

  // Estado
  comunas: Comuna[] = [];
  provincias: Provincia[] = [];
  modoEdicion = false;
  comunaEditandoId: number | null = null;
  filtroNombre = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';

  constructor(
    private comunasService: ComunaService,
    private provinciasService: ProvinciaService
  ) {}

  ngOnInit(): void {
    this.obtenerComunas();
    this.obtenerProvincias();
  }

  get comunasFiltradas(): Comuna[] {
    return this.comunas.filter(comuna => {
      const coincideNombre = comuna.comunaNombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && comuna.comunaActivo) ||
        (this.filtroEstado === 'inactivos' && !comuna.comunaActivo);
      return coincideNombre && coincideEstado;
    });
  }

  obtenerComunas(): void {
    this.comunasService.getComunas().subscribe({
      next: (comunas) => {
        this.comunas = comunas.map(c => ({ ...c, seleccionada: false }));
      },
      error: (err) => console.error('Error al obtener comunas:', err)
    });
  }

  obtenerProvincias(): void {
    this.provinciasService.getProvincias().subscribe({
      next: (provs) => this.provincias = provs,
      error: (err) => console.error('Error al obtener provincias:', err)
    });
  }

  abrirModal(): void {
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevaComunaNombre = '';
    this.nuevaComunaProvincia = null;
    this.nuevaComunaActivo = null;
    this.modoEdicion = false;
    this.comunaEditandoId = null;
    document.body.style.overflow = '';
  }

  guardarComuna(): void {
    if (
      this.nuevaComunaNombre.trim() &&
      this.nuevaComunaProvincia !== null &&
      this.nuevaComunaActivo !== null
    ) {
      const comunaAGuardar: Comuna = {
        comunaId: this.comunaEditandoId ?? 0,
        comunaNombre: this.nuevaComunaNombre.trim(),
        provinciaId: this.nuevaComunaProvincia,
        comunaActivo: this.nuevaComunaActivo,
        seleccionada: false
      };

      if (this.modoEdicion && this.comunaEditandoId !== null) {
        this.comunasService.actualizarComuna(comunaAGuardar).subscribe({
          next: (actualizada) => {
            const index = this.comunas.findIndex(c => c.comunaId === actualizada.comunaId);
            if (index !== -1) {
              this.comunas[index] = { ...actualizada, seleccionada: false };
            }
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar comuna:', err)
        });
      } else {
        this.comunasService.agregarComuna(comunaAGuardar).subscribe({
          next: (creada) => {
            this.comunas.push({ ...creada, seleccionada: false });
            this.cerrarModal();
          },
          error: (err) => console.error('Error al guardar comuna:', err)
        });
      }
    }
  }

  editarComuna(comuna: Comuna): void {
    this.modoEdicion = true;
    this.comunaEditandoId = comuna.comunaId;
    this.nuevaComunaNombre = comuna.comunaNombre;
    this.nuevaComunaProvincia = comuna.provinciaId;
    this.nuevaComunaActivo = comuna.comunaActivo;
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  eliminarComuna(comunaId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la comuna de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.comunasService.eliminarComuna(comunaId).subscribe({
          next: () => {
            this.comunas = this.comunas.filter(c => c.comunaId !== comunaId);
            Swal.fire('¡Eliminado!', 'La comuna ha sido eliminada.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar comuna:', err);
            Swal.fire('Error', 'No se pudo eliminar la comuna.', 'error');
          }
        });
      }
    });
  }

  obtenerNombreProvincia(provinciaId: number): string {
    const prov = this.provincias.find(p => p.provinciaId === provinciaId);
    return prov ? prov.provinciaNombre : 'Desconocida';
  }

  toggleSeleccionarTodo(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.comunas.forEach(c => c.seleccionada = seleccionado);
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

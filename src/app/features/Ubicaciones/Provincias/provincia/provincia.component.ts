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

import { Provincia } from '../provincia.model';
import { ProvinciaService } from '../provincia.service';
import { Region } from '../../Regiones/region.model';
import { RegionService } from '../../Regiones/region.service';

@Component({
  selector: 'app-provincia',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './provincia.component.html',
  styleUrl: './provincia.component.scss'
})
export class ProvinciaComponent implements OnInit, AfterViewChecked {
  modalVisible = false;
  private modalAbiertoPrev = false;
  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;

  // Formularios
  nuevaProvinciaNombre = '';
  nuevaProvinciaRegion: number | null = null;
  nuevaProvinciaActivo: boolean | null = null;

  // Estado
  modoEdicion = false;
  provinciaEditandoId: number | null = null;
  provincias: Provincia[] = [];
  regiones: Region[] = [];

  // Filtros
  filtroNombre = '';
  filtroEstado: 'todos' | 'activos' | 'inactivos' = 'todos';

  constructor(
    private provinciasService: ProvinciaService,
    private regionesService: RegionService
  ) {}

  ngOnInit(): void {
    this.obtenerProvincias();
    this.obtenerRegiones();
  }

  get provinciasFiltradas(): Provincia[] {
    return this.provincias.filter(p => {
      const coincideNombre = p.provinciaNombre.toLowerCase().includes(this.filtroNombre.toLowerCase());
      const coincideEstado =
        this.filtroEstado === 'todos' ||
        (this.filtroEstado === 'activos' && p.provinciaActivo) ||
        (this.filtroEstado === 'inactivos' && !p.provinciaActivo);

      return coincideNombre && coincideEstado;
    });
  }

  obtenerProvincias(): void {
    this.provinciasService.getProvincias().subscribe({
      next: (provincias) => {
        this.provincias = provincias.map(p => ({ ...p, seleccionada: false }));
      },
      error: (err) => console.error('Error al obtener provincias:', err)
    });
  }

  obtenerRegiones(): void {
    this.regionesService.getRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones;
      },
      error: (err) => console.error('Error al obtener regiones:', err)
    });
  }

  obtenerNombreRegion(regionId: number): string {
    const region = this.regiones.find(r => r.regionId === regionId);
    return region ? region.regionNombre : 'Sin región';
  }

  abrirModal(): void {
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevaProvinciaNombre = '';
    this.nuevaProvinciaRegion = null;
    this.nuevaProvinciaActivo = null;
    this.modoEdicion = false;
    this.provinciaEditandoId = null;
    document.body.style.overflow = '';
  }

  guardarProvincia(): void {
    if (
      this.nuevaProvinciaNombre.trim() &&
      this.nuevaProvinciaRegion !== null &&
      this.nuevaProvinciaActivo !== null
    ) {
      const provinciaAGuardar: Provincia = {
        provinciaId: this.provinciaEditandoId ?? 0,
        provinciaNombre: this.nuevaProvinciaNombre.trim(),
        regionId: this.nuevaProvinciaRegion,
        provinciaActivo: this.nuevaProvinciaActivo,
        seleccionada: false
      };

      if (this.modoEdicion && this.provinciaEditandoId !== null) {
        this.provinciasService.actualizarProvincia(provinciaAGuardar).subscribe({
          next: (actualizada) => {
            const index = this.provincias.findIndex(p => p.provinciaId === actualizada.provinciaId);
            if (index !== -1) {
              this.provincias[index] = { ...actualizada, seleccionada: false };
            }
            this.cerrarModal();
          },
          error: (err) => console.error('Error al actualizar provincia:', err)
        });
      } else {
        this.provinciasService.agregarProvincia(provinciaAGuardar).subscribe({
          next: (nueva) => {
            this.provincias.push({ ...nueva, seleccionada: false });
            this.cerrarModal();
          },
          error: (err) => console.error('Error al guardar provincia:', err)
        });
      }
    }
  }

  editarProvincia(provincia: Provincia): void {
    this.modoEdicion = true;
    this.provinciaEditandoId = provincia.provinciaId;
    this.nuevaProvinciaNombre = provincia.provinciaNombre;
    this.nuevaProvinciaRegion = provincia.regionId;
    this.nuevaProvinciaActivo = provincia.provinciaActivo;
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  eliminarProvincia(provinciaId: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará la provincia de forma permanente.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.provinciasService.eliminarProvincia(provinciaId).subscribe({
          next: () => {
            this.provincias = this.provincias.filter(p => p.provinciaId !== provinciaId);
            Swal.fire('¡Eliminado!', 'La provincia ha sido eliminada.', 'success');
          },
          error: (err) => {
            console.error('Error al eliminar provincia:', err);
            Swal.fire('Error', 'Ocurrió un problema al eliminar la provincia.', 'error');
          }
        });
      }
    });
  }

  toggleSeleccionarTodo(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.provincias.forEach(p => p.seleccionada = seleccionado);
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

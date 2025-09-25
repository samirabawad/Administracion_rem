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

import { RegionService } from '../region.service';
import { Region } from '../region.model'; // ajusta si tu ruta es distinta
import Swal from 'sweetalert2';


@Component({
  selector: 'app-region',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './region.component.html',
  styleUrl: './region.component.scss'
})
export class RegionComponent implements OnInit, AfterViewChecked {
  modalVisible = false;
  nuevaRegionNombre = '';
  nuevaRegionNumero = '';
  nuevaRegionActivo: boolean | null = null;


  regiones: Region[] = [];

  //Variables de edición
  modoEdicion = false;
  regionEditandoId: number | null = null;

  @ViewChild('nombreInput') nombreInput!: ElementRef<HTMLInputElement>;
  private modalAbiertoPrev = false;

  constructor(private regionesService: RegionService) {}

  ngOnInit(): void {
    this.obtenerRegiones();
  }
  

  obtenerRegiones(): void {
    this.regionesService.getRegiones().subscribe({
      next: (regiones) => {
        this.regiones = regiones.map(region => ({
          ...region,
          seleccionada: false // añadimos campo local para selección (si no viene del backend)
        }));
      },
      error: (error) => {
        console.error('Error al obtener regiones:', error);
      }
    });
  }


    // Método para abrir modal en modo edición
  editarRegion(region: Region): void {
    this.modoEdicion = true;
    this.regionEditandoId = region.regionId;
    this.nuevaRegionNombre = region.regionNombre;
    this.nuevaRegionNumero = region.regionNumero;
    this.nuevaRegionActivo = region.regionActivo;
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }


  abrirModal(): void {
    this.modalVisible = true;
    document.body.style.overflow = 'hidden';
  }

  // Ajusta cerrarModal para resetear modoEdicion
  cerrarModal(): void {
    this.modalVisible = false;
    this.nuevaRegionNombre = '';
    this.nuevaRegionNumero = '';
    this.nuevaRegionActivo = true;
    this.modoEdicion = false;
    this.regionEditandoId = null;
    document.body.style.overflow = '';
  }


  guardarRegion(): void {
  //validacion de que campos no estén vacíos
    if (
      this.nuevaRegionNombre.trim() &&
      this.nuevaRegionNumero.trim() &&
      this.nuevaRegionActivo !== null && this.nuevaRegionActivo !== undefined
    ) {
      const regionAGuardar: Region = {
        regionId: this.regionEditandoId ?? 0,
        regionNombre: this.nuevaRegionNombre.trim(),
        regionNumero: this.nuevaRegionNumero.trim(),
        regionActivo: this.nuevaRegionActivo,
        seleccionada: false
      };

      if (this.modoEdicion && this.regionEditandoId !== null) {
        // Modo edición: llamar a update
        this.regionesService.actualizarRegion(regionAGuardar).subscribe({
          next: (regionActualizada) => {
            // Actualizar la lista local
            const index = this.regiones.findIndex(r => r.regionId === regionActualizada.regionId);
            if (index !== -1) {
              this.regiones[index] = { ...regionActualizada, seleccionada: false };
            }
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al actualizar la región:', error);
          }
        });
      } else {
        // Modo crear nueva región
        this.regionesService.agregarRegion(regionAGuardar).subscribe({
          next: (regionCreada) => {
            this.regiones.push({ ...regionCreada, seleccionada: false });
            this.cerrarModal();
          },
          error: (error) => {
            console.error('Error al guardar la región:', error);
          }
        });
      }
    }
  }




eliminarRegion(regionId: number): void {
  Swal.fire({
    title: '¿Estás seguro?',
    text: 'Esta acción eliminará la región de forma permanente.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Sí, eliminar',
    cancelButtonText: 'Cancelar'
  }).then((result) => {
    if (result.isConfirmed) {
      this.regionesService.eliminarRegion(regionId).subscribe({
        next: () => {
          this.regiones = this.regiones.filter(r => r.regionId !== regionId);
          Swal.fire('¡Eliminado!', 'La región ha sido eliminada.', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar la región:', err);
          Swal.fire('Error', 'Ocurrió un problema al eliminar la región.', 'error');
        }
      });
    }
  });
}





  ngAfterViewChecked(): void {
    if (this.modalVisible && !this.modalAbiertoPrev) {
      this.nombreInput.nativeElement.focus();
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

  toggleSeleccionarTodo(event: Event): void {
    const seleccionado = (event.target as HTMLInputElement).checked;
    this.regiones.forEach(region => region.seleccionada = seleccionado);
  }
}

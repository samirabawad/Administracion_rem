// src/app/features/home/components/home/home.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../../../shared/components/banner/banner.component';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface Estadisticas {
  bienesActivos: number;
  subastas: number;
  usuarios: number;
  ventasHoy: number;
  montoTotal: number;
  cambioVentas: number;
  cambioMonto: number;
  comitentesActivos: number;
  cambioComitentes: number;
}

interface ActividadReciente {
  id: number;
  titulo: string;
  descripcion: string;
  fecha: Date;
  icono: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule, 
    BannerComponent,
    MatCardModule, 
    MatButtonModule, 
    MatIconModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  
  // Estadísticas del sistema
  estadisticas: Estadisticas = {
    bienesActivos: 156,
    subastas: 12,
    usuarios: 24,
    ventasHoy: 8,
    montoTotal: 45680000,
    cambioVentas: 15.2,
    cambioMonto: 8.7,
    comitentesActivos: 89,
    cambioComitentes: 0
  };

  // Actividad reciente del sistema
  actividadReciente: ActividadReciente[] = [
    {
      id: 1,
      titulo: 'Nueva importación de resultados',
      descripcion: 'Se importaron 24 resultados de la subasta del 20 de enero',
      fecha: new Date('2025-01-22T10:30:00'),
      icono: 'bi bi-upload'
    },
    {
      id: 2,
      titulo: 'Empleado creado',
      descripcion: 'Se registró un nuevo empleado: María Fernández - Operadora',
      fecha: new Date('2025-01-22T09:15:00'),
      icono: 'bi bi-person-plus'
    },
    {
      id: 3,
      titulo: 'Configuración de incrementos actualizada',
      descripcion: 'Se modificaron los incrementos para bienes de alto valor',
      fecha: new Date('2025-01-22T08:45:00'),
      icono: 'bi bi-gear'
    },
    {
      id: 4,
      titulo: 'Datos bancarios verificados',
      descripcion: 'Se completó la verificación de datos bancarios de 15 comitentes',
      fecha: new Date('2025-01-21T16:20:00'),
      icono: 'bi bi-bank'
    },
    {
      id: 5,
      titulo: 'Planilla extraída',
      descripcion: 'Se generó planilla con 42 bienes nuevos para subasta',
      fecha: new Date('2025-01-21T14:10:00'),
      icono: 'bi bi-download'
    }
  ];

  // Banners promocionales (manteniendo compatibilidad)
  promotions = [
    { image: 'assets/images/banners/banner1.jpg', buttonText: 'Ver más', link: '/extraccion-planilla' },
    { image: 'assets/images/banners/banner3.jpg', buttonText: 'Ver más', link: '/empleados' },
  ];

  information = [
    { image: 'assets/images/banners/banner2.jpg', buttonText: 'Ver más', link: '/datos-bancarios' },
  ];
  
  recentproducts: any[] = []; 
  recommendedProducts: any[] = []; 

  constructor() {}

  ngOnInit(): void {
    this.cargarEstadisticas();
    this.cargarActividadReciente();
  }

  /**
   * Cargar estadísticas del sistema
   * En producción, esto vendría de un servicio real
   */
  private cargarEstadisticas(): void {
    // Simular carga de datos del backend
    // En producción: this.homeService.getEstadisticas().subscribe(...)
    
    // Podrías agregar lógica para actualizar las estadísticas periódicamente
    // setInterval(() => this.actualizarEstadisticas(), 30000); // cada 30 segundos
  }

  /**
   * Cargar actividad reciente del sistema
   */
  private cargarActividadReciente(): void {
    // En producción: this.homeService.getActividadReciente().subscribe(...)
    
    // Los datos ya están inicializados arriba
    // Podrías ordenar por fecha o limitar la cantidad
    this.actividadReciente = this.actividadReciente
      .sort((a, b) => b.fecha.getTime() - a.fecha.getTime())
      .slice(0, 5); // Solo mostrar las últimas 5 actividades
  }

  /**
   * Actualizar estadísticas (para uso futuro con datos reales)
   */
  private actualizarEstadisticas(): void {
    // Simular variación en las estadísticas
    this.estadisticas.ventasHoy += Math.floor(Math.random() * 3);
    this.estadisticas.bienesActivos += Math.floor(Math.random() * 5) - 2;
    
    // Asegurar que no sean negativos
    this.estadisticas.ventasHoy = Math.max(0, this.estadisticas.ventasHoy);
    this.estadisticas.bienesActivos = Math.max(0, this.estadisticas.bienesActivos);
  }

  /**
   * Métodos de utilidad para el template
   */
  
  // Formatear números grandes
  formatearNumero(numero: number): string {
    if (numero >= 1000000) {
      return (numero / 1000000).toFixed(1) + 'M';
    } else if (numero >= 1000) {
      return (numero / 1000).toFixed(0) + 'K';
    }
    return numero.toString();
  }

  // Obtener saludo según la hora
  obtenerSaludo(): string {
    const hora = new Date().getHours();
    if (hora < 12) {
      return 'Buenos días';
    } else if (hora < 18) {
      return 'Buenas tardes';
    } else {
      return 'Buenas noches';
    }
  }

  // Verificar si hay actividad reciente (últimas 2 horas)
  tieneActividadReciente(): boolean {
    const dosHorasAtras = new Date(Date.now() - (2 * 60 * 60 * 1000));
    return this.actividadReciente.some(actividad => actividad.fecha > dosHorasAtras);
  }
}
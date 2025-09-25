import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-condiciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './condiciones.component.html',
  styleUrl: './condiciones.component.scss'
})
export class CondicionesComponent {
  condiciones = [
    {
      pregunta: '¿Cómo funciona la compra de productos en Dicrep?',
      respuesta: 'Los productos que vendemos son remanentes de prenda no recuperados. Se venden al mejor precio disponible sin opción a devolución.',
      abierto: false
    },
    {
      pregunta: '¿Puedo reservar un producto?',
      respuesta: 'No, los productos se venden por orden de llegada. La reserva no está habilitada en nuestro sistema.',
      abierto: false
    },
    {
      pregunta: '¿Hay garantía en los productos?',
      respuesta: 'No se ofrece garantía, ya que son productos usados o en condición actual de remate. Se recomienda revisar bien antes de comprar.',
      abierto: false
    },
    {
      pregunta: '¿Puedo pagar con tarjeta?',
      respuesta: 'Sí, aceptamos tarjetas de crédito y débito. También puedes pagar en efectivo.',
      abierto: false
    }
  ];
}

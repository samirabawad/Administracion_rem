import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ClaveUnicaComponent } from '../clave-unica/clave-unica.component';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [CommonModule, RouterModule, ClaveUnicaComponent],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.scss'
})

export class NavBarComponent{

  //Propiedades
  isLoggedIn = false; //Manejar a futuro es estado de autenticación con él

  cartItemCount = 0; // Contador de ítems en el carrito
  menuOpen: boolean = false; // Estado para saber si el menú está abierto o cerrado

  constructor() {}


  //Métodos

  //Cerrar sesión
  logout(): void {
    // Lógica a implementar
  }

  //Colapsa menú
  closeMenu(): void {
      this.menuOpen = false;
      const menuElement = document.getElementById('navbarContent');
      if (menuElement?.classList.contains('show')) {
          menuElement.classList.remove('show');
      }
  }

  //Al hacer clic, cambia el estado de "menuOpen" a abierto/cerrado
  toggleMenu(): void {
      this.menuOpen = !this.menuOpen; 
  }

}

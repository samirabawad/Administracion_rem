import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import * as uuid from 'uuid';
import { environment } from '../../../environments/environment.development';

@Component({
  selector: 'app-clave-unica',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './clave-unica.component.html',
  styleUrl: './clave-unica.component.scss'
})
export class ClaveUnicaComponent {
  @Input() isMobile: boolean = false;
  @Input() hasMenu: boolean = false;
  @Input() buttonText: string = 'Iniciar sesión';


  //clientId = environment.clientIdClaveUnica;
  //redirectUri = environment.redirecUriClaveUnica;
  //response_type= 'code'
  //scope = 'openid run name'

  // Agrega esta variable
  public displayedToken: string = '';
  
  // Generar un token único de sesión
  generateSessionToken(): string {
    const randomPart = window.crypto.getRandomValues(new Uint32Array(4)).join('');
    const timestamp = Date.now().toString(36);
    return `cu_${timestamp}_${randomPart}`.substring(0, 32);
  }

// Ejemplo de uso
//const stateToken = this.generateSessionToken();
// Guardar en sessionStorage para mantener el estado
//sessionStorage.setItem('claveUnicaState', stateToken);


    //uri encodeado
    //const encodedUrl = encodeURIComponent(this.redirectUri);

    //este valor debe ser un codigo alfanumerico aleatorio como identificador unico de sesión.wid
    //const state = uuid.v4();

    //url de autorización de Clave Única
    //const url = `https://accounts.claveunica.gob.cl/openid/authorize/?`;
    //const params = `client_id=${this.clientId}&response_type=${this.response_type}&scope=${this.scope}&redirect_uri=${this.redirectUri}&state=${state}`;


    //se realiza la redirección del navegador a la URL construida con los parámetros. 
    //En este punto, el usuario ingresará sus credenciales (RUT y clave) en la página de Clave Única.
    //window.location.href =  url + params;
  
loginClaveUnica() {
  // Generas el token
  const stateToken = this.generateSessionToken();

  // Lo guardas en sessionStorage
  sessionStorage.setItem('claveUnicaState', stateToken);
  
  // URL codificada correctamente
  const redirectUri = encodeURIComponent('https://adminrematestest.tiarica.cl');
  
  // Rediriges a Clave Única incluyendo el token
  const authUrl = `https://accounts.claveunica.gob.cl/openid/authorize?` +
    `client_id=4c73134c372a4e4c9739c39e72963d33&` +
    `response_type=code&` +
    `scope=openid run name&` +
    `redirect_uri=${redirectUri}&` +
    `state=${stateToken}`;

  console.log('URL de redirección:', authUrl); // Para debug
  window.location.href = authUrl;
}
}

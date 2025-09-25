// empleado.model.ts
export interface Cliente {
  clienteId: number;
  clienteNombre: string;
  clienteSegundoNombre: string;
  clienteApellido: string;
  clienteSegundoApellido: string;
  empSegundoNombre: string;
  empApellido: string;
  empSegundoApellido: string;
  clienteCorreo: string;
  clienteRut: number;
  clienteRutDig: string;
  clienteTelefono: string;
  clienteCalle: string;
  clienteNumeroCalle: string;
  clienteVillaPoblacion: string;
  clienteDepto: string;
  clienteEsEmpresa: boolean;
  generoId: number;
  comunaId: number;
  seleccionada?: boolean;
}



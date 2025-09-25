// empleado.model.ts
export interface Empleado {
  empId: number;
  empUsuario: string;
  empRut: number;
  empRutDig: string;
  empNombre: string;
  empSegundoNombre: string;
  empApellido: string;
  empSegundoApellido: string;
  empAnexo: string;
  empCorreo: string;
  empActivo: boolean;
  empFechaLog: string;
  empFechaExp: string;
  perfilId: number;
  sucursalId: number;
  authMethod: number;
  password: string;
  seleccionada?: boolean;
}

export interface Region {
  regionId: number;          // Antes: id
  regionNombre: string;      // Antes: nombre
  regionNumero: string;      // Nuevo (no estaba en tu modelo)
  regionActivo: boolean;     // Antes: region_activo
  seleccionada?: boolean;    // (Opcional: para uso local en el componente)
}
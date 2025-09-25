export interface Provincia {
  provinciaId: number;          // Antes: id
  provinciaNombre: string;      // Antes: nombre
  regionId: number;      // Nuevo (no estaba en tu modelo)
  provinciaActivo: boolean;     // Antes: region_activo
  seleccionada?: boolean;    // (Opcional: para uso local en el componente)
}










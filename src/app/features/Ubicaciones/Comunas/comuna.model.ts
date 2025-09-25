

export interface Comuna {
  comunaId: number;          // Antes: id
  comunaNombre: string;      // Antes: nombre
  provinciaId: number;      // Nuevo (no estaba en tu modelo)
  comunaActivo: boolean;     // Antes: region_activo
  seleccionada?: boolean;    // (Opcional: para uso local en el componente)
}










export interface FacturasRequest {
  idFactura: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: string;
  igv: string;
  total: string;
  estado: string;
  idPersona: number;
  idUsuario: number;
}

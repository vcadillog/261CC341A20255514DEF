import { PersonaResponse } from "./persona-response";
import { UsuarioResponse } from "./usuario-response";

export interface FacturasResponse {
  idFactura: number;
  serie: string;
  numero: string;
  fechaEmision: string;
  fechaVencimiento: string;
  subtotal: number;
  igv: number;
  total: number;
  estado: string;
  persona: PersonaResponse;
  usuario: UsuarioResponse;
}

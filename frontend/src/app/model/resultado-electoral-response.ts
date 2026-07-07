export interface ResultadoElectoralResponse {
  idResultado: number;
  idCandidato: number;
  candidato: string;
  partido: string;
  votosNacionales: number;
  votosExtranjero: number;
  totalVotos: number;
}

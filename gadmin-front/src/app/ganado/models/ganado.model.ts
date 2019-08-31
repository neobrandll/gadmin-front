export interface SearchGanadoResponse {
  rs: SearchGanadoResultSet[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  totalItems: string;
}

export interface SearchGanadoInput {
  dateTo?: Date;
  dateFrom?: Date;
  idRaza?: number;
  tipoGanado?: number;
  idEstadoGanado?: number;
}
export interface SearchGanadoResultSet {
  id_ganado: number;
  co_ganado: number;
  fo_ganado: string | null;
  de_raza: string;
  de_tipo_ganado: string;
  fe_ganado: string;
}

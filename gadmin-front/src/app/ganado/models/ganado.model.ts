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
  dateTo?: string;
  dateFrom?: string;
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

export interface Ganado {
  id_ganado: number;
  id_raza: number;
  id_estado_ganado: number;
  id_tipo_ganado: number;
  id_empresa: number;
  pe_ganado: number;
  fo_ganado: string;
  fe_ganado: string;
  id_pa_ganado: number;
  id_ma_ganado: number;
  id_pa_pajuela: number;
  co_ganado: number;
  de_raza: string;
  lotes: any;
  madre_codigo: number | null;
  padre_codigo: number | null;
  pajuela_padre_codigo: number | null;
}

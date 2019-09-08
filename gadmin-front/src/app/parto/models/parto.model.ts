export interface SearchPartoResultSet {
  rs: SearchParto[];
  currentPage: number;
  hasNextPage: false;
  hasPreviousPage: false;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  totalItems: any;
}

export interface SearchParto {
  nu_crias: string;
  id_actividad: number;
  fe_actividad: string;
  de_actividad: string;
  co_ma_ganado: null | number;
  co_pa_pajuela: null | number;
  co_pa_ganado: null | number;
  id_tipo_actividad: number;
}

export interface Parto {
  crias: {
    co_ganado: number;
    id_tipo_ganado: number;
    pe_ganado: number;
    co_pa_ganado: null | number;
    id_pa_ganado: number;
    co_ma_ganado: null | number;
    id_ma_ganado: number;
    co_pa_pajuela: null | number;
    id_pa_pajuela: number;
    id_actividad: number;
    id_tipo_actividad: number;
    de_actividad: string;
    fe_actividad: string;
    de_tipo_actividad: string;
    de_tipo_ganado: string;
  }[];
}

export interface SearchPartoInput {
  dateTo?: string;
  dateFrom?: string;
  coMaGanado?: number;
  coPaGanado?: number;
  coPaPajuela?: number;
  idTipoActividad?: number;
  filter?: string;
}

export interface CreateParto {
  idEmpresa: number;
  coMaGanado: number;
  coPaPajuela?: number;
  coPaGanado?: number;
  feActividad: string;
  idTipoActividad: number;
  deActividad: string;
  crias: { tipoGanado: number; coGanado: number; peGanado: number }[];
}

export interface Cria {
  tipoGanado?: number;
  deTipoGanado?: string;
  coGanado: number;
  peGanado: number;
}

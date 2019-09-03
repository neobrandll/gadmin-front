export interface SearchProduccionResultSet {
  rs: Produccion[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  totalItems: any;
}

export interface Produccion {
  id_produccion: number;
  id_tipo_produccion: number;
  id_unidad: number;
  id_empresa: number;
  fe_produccion: string;
  ca_produccion: number;
  de_tipo_produccion: string;
}

export interface SearchProduccionInput {
  dateTo?: string;
  dateFrom?: string;
  idTipoProduccion?: number;
}

export interface CreateProduccion {
  feProduccion: string;
  idTipoProduccion: number;
  caProduccion: number;
  idEmpresa: number;
}

export interface UpdateProduccion {
  feProduccion: string;
  idTipoProduccion: number;
  caProduccion: number;
  idEmpresa: number;
  idProduccion: number;
}

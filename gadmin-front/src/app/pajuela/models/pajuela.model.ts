export interface SearchPajuelaInput {
  dateTo?: string;
  dateFrom?: string;
  idRaza?: number;
  filter?: string;
}

export interface Pajuela {
  id_pajuela: number;
  id_raza: number;
  id_empresa: number;
  fe_pajuela: string;
  de_pajuela: string;
  co_pajuela: number;
  de_raza: string;
}

export interface SearchPajuelaResultSet {
  rs: Pajuela[];
  currentPage: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  nextPage: number;
  previousPage: number;
  lastPage: number;
  totalItems: any;
}

export interface CreatePajuela {
  idEmpresa: number;
  idRaza: number;
  dePajuela: string;
  coPajuela: number;
  fePajuela: string;
}

export interface UpdatePajuela {
  idEmpresa: number;
  idRaza: number;
  dePajuela: string;
  coPajuela: number;
  fePajuela: string;
  newCoPajuela: number;
}

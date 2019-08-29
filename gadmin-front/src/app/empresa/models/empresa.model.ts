export interface EmpresaInput {
  nombreEmpresa: string;
  rifEmpresa: number;
  pais: string;
  estado: string;
  ciudad: string;
  calle: string;
}

export interface CreateEmpresaResponse {
  msg: string;
  empresa: {
    id_empresa: number;
    id_usuario: number;
    id_direccion: number;
    no_empresa: string;
    ri_empresa: string;
  };
}

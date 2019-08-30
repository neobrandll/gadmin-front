export interface RazaResponse {
  razas: [
    {
      id_raza: number;
      id_empresa: number;
      de_raza: string;
    }
  ];
}

export interface Raza {
  id_raza: number;
  id_empresa: number;
  de_raza: string;
}

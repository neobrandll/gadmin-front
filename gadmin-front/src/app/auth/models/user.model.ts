export interface EmpresaLogin {
  id: number;
  nombre: string;
  rif: string;
}

export class User {
  constructor(
    // tslint:disable-next-line:variable-name
    private _token: string,
    // tslint:disable-next-line:variable-name
    private _tokenExpirationDate: Date,
    public id: number,
    public nombre: string,
    public apellido: string,
    public email: string,
    public telf: string,
    public cedula: string,
    public user: string,
    public empresas: EmpresaLogin[]
  ) {}

  get token() {
    if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
      return null;
    }
    return this._token;
  }
}

export interface LoginResponse {
  token: string;
  payload: {
    id_usuario: number;
    profile: {
      no_persona: string;
      ap_persona: string;
      em_persona: string;
      te_persona: string;
      ci_persona: string;
      us_usuario: string;
      empresas: EmpresaLogin[];
    };
  };
  msg: string;
}

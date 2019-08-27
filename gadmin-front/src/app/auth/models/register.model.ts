export interface RegisterInput {
  nombre: string;
  apellido: string;
  email: string;
  telf: string;
  ci: number;
  password: string;
  confirmPassword: string;
  user: string;
  pais: string;
  estado: string;
  ciudad: string;
  calle: string;
}

export interface RegisterResponse {
  msg: string;
  id_usuario: {
    id_usuario: number;
  };
}

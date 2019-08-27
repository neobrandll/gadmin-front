export interface UpdateAddressResponse {
  msg: string;
  updatedAddress: {
    pa_direccion: string;
    es_direccion: string;
    ci_direccion: string;
    ca_direccion: string;
  };
}

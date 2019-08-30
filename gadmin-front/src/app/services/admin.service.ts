import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { map } from 'rxjs/operators';

export interface PerfilesyPermisos {
  perfilesDetallados: [
    {
      id_perfil: number;
      de_perfil: string;
      id_empresa: number;
      de_permiso: string;
      id_permiso: number;
      no_empresa: string;
    }
  ];
  permisos: number[];
  distintosPerfiles: [
    {
      id_perfil: number;
      de_perfil: string;
    },
    {
      id_perfil: number;
      de_perfil: string;
    }
  ];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  constructor(private http: HttpClient) {}

  getPerfilesyPermisos(idEmpresa: number) {
    return this.http.get<PerfilesyPermisos>(`${environment.url}/empresa/profiles/${idEmpresa}`);
  }
}

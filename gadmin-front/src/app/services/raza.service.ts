import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap } from 'rxjs/operators';
import { Raza, RazaResponse } from '../raza/models/raza.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RazaService {
  constructor(private http: HttpClient, private authService: AuthService) {}

  getRazas() {
    return this.authService.empresa.pipe(
      switchMap(empresaData => {
        return this.http.get<RazaResponse>(
          `${environment.url}/ganado/razas/${empresaData.id_empresa}`
        );
      })
    );
  }
}

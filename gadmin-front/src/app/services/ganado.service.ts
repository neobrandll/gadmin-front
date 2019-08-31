import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';
import { SearchGanadoInput, SearchGanadoResponse } from '../ganado/models/ganado.model';
import { map, switchMap, take } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class GanadoService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  searchGanado(params?: SearchGanadoInput) {
    const paramArr = [];
    let queryString;
    if (params) {
      if (!(Object.entries(params).length === 0)) {
        for (const property in params) {
          if (params.hasOwnProperty(property)) {
            paramArr.push(`${property.toString()}=${params[property]}`);
          }
        }
      }
    }
    if (paramArr.length > 0) {
      queryString = '';
      for (const [index, value] of paramArr.entries()) {
        if (index === 0) {
          queryString += `?${value}`;
        } else {
          queryString += `&${value}`;
        }
      }
    }
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        let url = `${environment.url}/ganado/search/${empresaData.id_empresa}`;
        if (queryString && queryString.trim() !== '') {
          url += queryString.trim();
        }
        return this.http.get<SearchGanadoResponse>(url);
      }),
      map(ganadoList => {
        return ganadoList.rs;
      })
    );
  }
}

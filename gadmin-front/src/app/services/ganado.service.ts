import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';
import { Ganado, SearchGanadoInput, SearchGanadoResponse } from '../ganado/models/ganado.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { Form } from '@angular/forms';

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

  createGanado(ganadoData: FormData) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'multipart/form-data'
      })
    };
    return this.http.post(`${environment.url}/ganado`, ganadoData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Ganado creado',
            `El Ganado fue creado con exito`,
            () => {
              this.router.navigate(['/ganado']);
            }
          );
        },
        errorData => {
          let allErrors = '';
          for (const [index, error] of errorData.error.data.entries()) {
            if (index === 0) {
              allErrors += `${error.msg}`;
            } else {
              allErrors += `, ${error.msg}`;
            }
          }
          this.dialogService.openSimpleDialog('Error', allErrors, () => {});
        }
      )
    );
  }

  getGanado(coGanado: string | number) {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<Ganado>(
          `${environment.url}/ganado/${empresaData.id_empresa}/${coGanado}`
        );
      }),
      tap(
        () => {},
        errorData => {
          let allErrors = '';
          for (const [index, error] of errorData.error.data.entries()) {
            if (index === 0) {
              allErrors += `${error.msg}`;
            } else {
              allErrors += `, ${error.msg}`;
            }
          }
          this.dialogService.openSimpleDialog('Error', allErrors, () => {
            this.router.navigate(['/ganado']);
          });
        }
      )
    );
  }
}

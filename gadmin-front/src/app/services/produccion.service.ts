import { Injectable } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import {
  CreateProduccion,
  Produccion,
  SearchProduccionInput,
  SearchProduccionResultSet,
  UpdateProduccion
} from '../produccion/models/produccion.model';

@Injectable({
  providedIn: 'root'
})
export class ProduccionService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService
  ) {}

  getProduccion(idProduccion: string | number) {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<Produccion>(
          `${environment.url}/produccion/${empresaData.id_empresa}/${idProduccion}`
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
            this.router.navigate(['/produccion']);
          });
        }
      )
    );
  }

  searchProduccion(producto: string, params?: SearchProduccionInput) {
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
        let url = `${environment.url}/produccion/search/${empresaData.id_empresa}/${producto}`;
        if (queryString && queryString.trim() !== '') {
          url += queryString.trim();
        }
        return this.http.get<SearchProduccionResultSet>(url);
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
          this.dialogService.openSimpleDialog('Error', allErrors, () => {});
        }
      ),
      map(produccionList => {
        return produccionList.rs;
      })
    );
  }

  createProduccion(produccionData: CreateProduccion, producto) {
    return this.http.post(`${environment.url}/produccion`, produccionData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Producción creada',
            `La Producción fue creada con exito`,
            () => {
              this.router.navigate(['/produccion', producto]);
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

  updateProduccion(produccionData: UpdateProduccion, producto) {
    return this.http.put(`${environment.url}/produccion`, produccionData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Producción actualizada',
            `La Producción fue actualizada con exito`,
            () => {
              this.router.navigate(['/produccion', producto]);
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

  deleteProduccion(idProduccion: string | number, idEmpresa: string | number, producto: string) {
    return this.http.delete(`${environment.url}/produccion/${idEmpresa}/${idProduccion}`).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Producción eliminada',
            `La Producción fue eliminada con exito`,
            () => {
              this.router.navigate(['/produccion', producto]);
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
}

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  CreateParto,
  Parto,
  SearchPartoInput,
  SearchPartoResultSet
} from '../parto/models/parto.model';

@Injectable({
  providedIn: 'root'
})
export class PartoService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  searchParto(params?: SearchPartoInput) {
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
        let url = `${environment.url}/actividad/partos/${empresaData.id_empresa}`;
        if (queryString && queryString.trim() !== '') {
          url += queryString.trim();
        }
        return this.http.get<SearchPartoResultSet>(url);
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
      map(partoList => {
        return partoList.rs;
      })
    );
  }

  createParto(partoData: CreateParto) {
    return this.http.post(`${environment.url}/actividad/parto`, partoData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Parto creado',
            `El Parto fue creado con exito`,
            () => {
              this.router.navigate(['/parto']);
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

  getParto(idParto: string | number) {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<Parto>(
          `${environment.url}/actividad/parto/${empresaData.id_empresa}/${idParto}`
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
            this.router.navigate(['/parto']);
          });
        }
      )
    );
  }
}

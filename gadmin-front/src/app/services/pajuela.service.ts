import { Injectable } from '@angular/core';
import { Ganado, SearchGanadoInput, SearchGanadoResponse } from '../ganado/models/ganado.model';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import {
  CreatePajuela,
  Pajuela,
  SearchPajuelaInput,
  SearchPajuelaResultSet,
  UpdatePajuela
} from '../pajuela/models/pajuela.model';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class PajuelaService {
  constructor(
    private authService: AuthService,
    private http: HttpClient,
    private dialogService: DialogService,
    private router: Router
  ) {}

  searchPajuela(params?: SearchPajuelaInput) {
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
        let url = `${environment.url}/pajuela/search/${empresaData.id_empresa}`;
        if (queryString && queryString.trim() !== '') {
          url += queryString.trim();
        }
        return this.http.get<SearchPajuelaResultSet>(url);
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
      map(pajuelaList => {
        return pajuelaList.rs;
      })
    );
  }

  createPajuela(pajuelaData: CreatePajuela) {
    return this.http.post(`${environment.url}/pajuela`, pajuelaData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Pajuela creada',
            `La Pajuela fue creada con exito`,
            () => {
              this.router.navigate(['/pajuela']);
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

  updatePajuela(pajuelaData: UpdatePajuela) {
    return this.http.put(`${environment.url}/pajuela`, pajuelaData).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Pajuela actualizada',
            `La Pajuela fue actualizada con exito`,
            () => {
              this.router.navigate(['/pajuela']);
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

  getPajuela(coPajuela: string | number) {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<Pajuela>(
          `${environment.url}/pajuela/${empresaData.id_empresa}/${coPajuela}`
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
            this.router.navigate(['/pajuela']);
          });
        }
      )
    );
  }
}

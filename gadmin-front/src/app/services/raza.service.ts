import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { switchMap, take, tap } from 'rxjs/operators';
import { Raza, RazaResponse } from '../raza/models/raza.model';
import { environment } from '../../environments/environment';
import { DialogService } from './dialog.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RazaService {
  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  getRazas() {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<RazaResponse>(
          `${environment.url}/ganado/razas/${empresaData.id_empresa}`
        );
      })
    );
  }

  getRaza(idRaza: number) {
    return this.authService.empresa.pipe(
      take(1),
      switchMap(empresaData => {
        return this.http.get<Raza>(
          `${environment.url}/ganado/raza/${empresaData.id_empresa}/${idRaza}`
        );
      }),
      tap(
        () => {},
        error => {
          let allErrors = '';
          for (error of error.error.data) {
            allErrors += ` ${error.msg}`;
          }
          this.dialogService.openSimpleDialog('Error', allErrors, () => {
            this.router.navigate(['/raza']);
          });
        }
      )
    );
  }
  updateRaza(deRaza: string, idEmpresa: number, idRaza: number) {
    return this.http.put(`${environment.url}/ganado/raza`, { deRaza, idEmpresa, idRaza }).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Raza actualizada',
            `La raza ${deRaza} fue actualizada con exito`,
            () => {
              this.router.navigate(['/raza']);
            }
          );
        },
        error => {
          let allErrors = '';
          for (error of error.error.data) {
            allErrors += ` ${error.msg}`;
          }
          this.dialogService.openSimpleDialog('Error', allErrors, () => {});
        }
      )
    );
  }

  createRaza(deRaza: string, idEmpresa: number) {
    return this.http.post(`${environment.url}/ganado/raza`, { deRaza, idEmpresa }).pipe(
      tap(
        () => {
          this.dialogService.openSimpleDialog(
            'Raza creada!',
            `La raza ${deRaza} fue creada con exito`,
            () => {
              this.router.navigate(['/raza']);
            }
          );
        },
        error => {
          let allErrors = '';
          for (error of error.error.data) {
            allErrors += ` ${error.msg}`;
          }
          this.dialogService.openSimpleDialog('Error', allErrors, () => {});
        }
      )
    );
  }
}

import { Injectable } from '@angular/core';
import { CreateEmpresaResponse, EmpresaInput } from '../empresa/models/empresa.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { DialogService } from './dialog.service';
import { environment } from '../../environments/environment';
import { exhaustMap, switchMap, take, tap } from 'rxjs/operators';
import { User } from '../auth/models/user.model';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor(
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService,
    private authService: AuthService
  ) {}

  createEmpresa(empresaInput: EmpresaInput) {
    let oldUser: User;
    return this.authService.user.pipe(
      take(1),
      exhaustMap(user => {
        oldUser = user;
        return this.http.post<CreateEmpresaResponse>(`${environment.url}/empresa`, empresaInput);
      }),
      tap(
        response => {
          const newUser = new User(
            oldUser.token,
            oldUser._tokenExpirationDate,
            oldUser.id,
            oldUser.nombre,
            oldUser.apellido,
            oldUser.email,
            oldUser.telf,
            oldUser.cedula,
            oldUser.user,
            [
              ...oldUser.empresas,
              {
                id_empresa: response.empresa.id_empresa,
                no_empresa: response.empresa.no_empresa,
                ri_empresa: response.empresa.ri_empresa
              }
            ]
          );
          this.authService._user.next(newUser);
          this.dialogService.openSimpleDialog(
            'Empresa Creada',
            `la empresa ${response.empresa.no_empresa} fue creada con exito`,
            () => {
              this.router.navigate(['/auth/preMenu']);
            }
          );
        },
        error => {
          this.dialogService.openSimpleDialog('Error', error.error.message, () => {});
        }
      )
    );
  }
}

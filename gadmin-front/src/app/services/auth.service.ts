import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';

import { environment } from '../../environments/environment';
import { EmpresaLogin, LoginResponse, User } from '../auth/models/user.model';
import { take, tap } from 'rxjs/operators';
import { RegisterInput, RegisterResponse } from '../auth/models/register.model';
import { UpdateAddressResponse } from '../auth/models/update-user.model';
import { DialogService } from './dialog.service';
import { EmpresaService } from './empresa.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // tslint:disable-next-line:variable-name
  private _user = new BehaviorSubject(null);

  get user() {
    return this._user.asObservable();
  }
  // tslint:disable-next-line:variable-name
  private _empresa = new BehaviorSubject<EmpresaLogin>(null);
  private tokenExpirationTimer: any;
  private url = environment.url;
  constructor(
    // private empresaService: EmpresaService,
    private http: HttpClient,
    private router: Router,
    private dialogService: DialogService
  ) {}

  get empresa() {
    return this._empresa.asObservable();
  }

  setEmpresa(empresa: EmpresaLogin) {
    localStorage.removeItem('empresaData');
    localStorage.setItem('empresaData', JSON.stringify(empresa));
    this._empresa.next(empresa);
  }

  // El usuario puede iniciar sesion con el usuario o con el correo
  login(userOrEmail: string, password: string) {
    return this.http
      .post<LoginResponse>(`${this.url}/auth/login`, {
        user: userOrEmail,
        password
      })
      .pipe(
        tap(
          resData => {
            this.authHandler(resData);
            this.router.navigate(['/auth', 'preMenu']);
          },
          error => {
            console.log(error);
            this.dialogService.openSimpleDialog('Error', error.error.message, () => {
              this.router.navigate(['/auth/login']);
            });
          }
        )
      );
  }

  private authHandler(resData: LoginResponse) {
    const expirationTime = new Date().getTime() + 4.9 * 60 * 60 * 1000;
    const tokenExpirationDate = new Date(expirationTime);
    const user = new User(
      resData.token,
      tokenExpirationDate,
      resData.payload.id_usuario,
      resData.payload.profile.no_persona,
      resData.payload.profile.ap_persona,
      resData.payload.profile.em_persona,
      resData.payload.profile.te_persona,
      resData.payload.profile.ci_persona,
      resData.payload.profile.us_usuario,
      resData.payload.profile.empresas
    );
    this._user.next(user);
    this.autoLogout(4.9 * 60 * 60 * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }

  updateUser(updatedUser: User) {
    localStorage.removeItem('userData');
    localStorage.setItem('userData', JSON.stringify(updatedUser));
    this._user.next(updatedUser);
  }

  autoLogout(expirationDuration: number) {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
    this.tokenExpirationTimer = setTimeout(() => {
      this.dialogService.openSimpleDialog(
        'Su sesión expiro',
        'sera redirigido al inicio de sesión',
        () => {
          this.logout();
        }
      );
    }, expirationDuration);
  }

  logout() {
    this._user.next(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('empresaData');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
    this.router.navigate(['/auth/login']);
  }

  autoLogin() {
    const userData: {
      _token: string;
      _tokenExpirationDate: string;
      id: number;
      nombre: string;
      apellido: string;
      email: string;
      telf: string;
      cedula: string;
      user: string;
      empresas: EmpresaLogin[];
    } = JSON.parse(localStorage.getItem('userData'));
    if (!userData) {
      return of(true);
    }
    const loadedUser = new User(
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.id,
      userData.nombre,
      userData.apellido,
      userData.email,
      userData.telf,
      userData.cedula,
      userData.user,
      userData.empresas
    );
    if (loadedUser.token) {
      this._user.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() - new Date().getTime();
      this.autoLogout(expirationDuration);
      const empresaData: {
        id_empresa: number;
        no_empresa: string;
        ri_empresa: string;
      } = JSON.parse(localStorage.getItem('empresaData'));
      if (empresaData) {
        this.setEmpresa(empresaData);
      }
    }
    return of(true);
  }

  register(registerInput: RegisterInput) {
    return this.http.post<RegisterResponse>(`${this.url}/auth/registro`, registerInput).pipe(
      tap(
        response => {
          this.dialogService.openSimpleDialog(
            'Registro Satisfactorio',
            'sera redirigido al inicio de sesión',
            () => {
              this.router.navigate(['auth/login']);
              console.log(response);
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

  updateAddress(pais: string, estado: string, ciudad: string, calle: string) {
    return this.http
      .post<UpdateAddressResponse>(`${this.url}/auth/updateAddress`, {
        pais,
        estado,
        ciudad,
        calle
      })
      .pipe(
        tap(
          response => {
            // dialogo y redirigir a profile
          },
          error => {
            // HANDLE ERROR
          }
        )
      );
  }
}

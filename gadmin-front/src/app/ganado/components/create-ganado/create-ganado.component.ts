import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { take } from 'rxjs/operators';
import { RazaService } from '../../../services/raza.service';
import { Raza } from '../../../raza/models/raza.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog.service';
import { GanadoService } from '../../../services/ganado.service';

@Component({
  selector: 'app-create-ganado',
  templateUrl: './create-ganado.component.html',
  styleUrls: ['./create-ganado.component.scss']
})
export class CreateGanadoComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  razas: Raza[];
  maxDate = new Date();
  fotoGanado: File;
  ganadoForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private razaService: RazaService,
    private dialogService: DialogService,
    private ganadoService: GanadoService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.razaService
      .getRazas()
      .pipe(take(1))
      .subscribe(rs => {
        this.razas = rs.razas;
        this.ganadoForm = new FormGroup({
          idRaza: new FormControl(null, {
            validators: [Validators.required]
          }),
          tipoGanado: new FormControl(null, {
            validators: [Validators.required]
          }),
          idEstadoGanado: new FormControl(null, {
            validators: [Validators.required]
          }),
          date: new FormControl(null, {
            validators: [Validators.required]
          }),
          codigoGanado: new FormControl(null, {
            validators: [Validators.required, Validators.max(999999999)]
          }),
          pesoGanado: new FormControl(null, {
            validators: [Validators.required]
          })
        });
      });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.empresaSub) {
      this.empresaSub.unsubscribe();
    }
  }

  onFileSelect(foto: File) {
    this.fotoGanado = foto;
  }

  onCreate() {
    if (this.ganadoForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    const idEstadoGanado = this.ganadoForm.value.idEstadoGanado;
    const tipoGanado = this.ganadoForm.value.tipoGanado;
    const codigoGanado = this.ganadoForm.value.codigoGanado;
    const pesoGanado = this.ganadoForm.value.pesoGanado;
    const date: Date = this.ganadoForm.value.date;
    const idRaza = this.ganadoForm.value.idRaza;
    if (+idEstadoGanado === 4 && +tipoGanado === 1) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El tipo de ganado no coincide con el estado del ganado',
        () => {}
      );
      return;
    }
    if (!codigoGanado || !Number.isInteger(codigoGanado)) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código del Ganado debe de ser un número entero',
        () => {}
      );
      return;
    }
    if (typeof pesoGanado !== 'number') {
      this.dialogService.openSimpleDialog(
        'Error',
        'El peso del ganado debe de ser un número',
        () => {}
      );
      return;
    }
    if (this.fotoGanado) {
      if (
        this.fotoGanado.type !== 'image/jpg' &&
        this.fotoGanado.type !== 'image/jpeg' &&
        this.fotoGanado.type !== 'image/png'
      ) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El formato de la foto es invalido, solo se permiten jpg, jpeg y png',
          () => {}
        );
        return;
      }
    }
    const ganadoDate = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const FD = new FormData();
    FD.set('idRaza', idRaza);
    FD.set('idEmpresa', `${this.empresa.id_empresa}`);
    FD.set('tipoGanado', tipoGanado);
    FD.set('idEstadoGanado', idEstadoGanado);
    FD.set('peGanado', `${pesoGanado}`);
    FD.set('feGanado', `${ganadoDate}`);
    FD.set('coGanado', `${codigoGanado}`);
    if (this.fotoGanado) {
      FD.set('foGanado', this.fotoGanado);
    }
    this.isLoading = true;
    this.ganadoService.createGanado(FD).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

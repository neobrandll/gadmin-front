import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute } from '@angular/router';
import { GanadoService } from '../../../services/ganado.service';
import { switchMap, take } from 'rxjs/operators';
import { Ganado } from '../../models/ganado.model';
import { Raza } from '../../../raza/models/raza.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RazaService } from '../../../services/raza.service';
import { environment } from '../../../../environments/environment';
import { DialogService } from '../../../services/dialog.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-ganado-profile',
  templateUrl: './ganado-profile.component.html',
  styleUrls: ['./ganado-profile.component.scss']
})
export class GanadoProfileComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  ganado: Ganado;
  razas: Raza[];
  maxDate = new Date();
  fotoGanado: File;
  ganadoForm: FormGroup;
  isLoading = false;
  ganadoURL: string | ArrayBuffer;
  constructor(
    private authService: AuthService,
    private route: ActivatedRoute,
    private ganadoService: GanadoService,
    private razaService: RazaService,
    private dialogService: DialogService,
    private location: Location
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
      });
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          return this.ganadoService.getGanado(+paramMap.get('coGanado'));
        })
      )
      .subscribe(ganadoData => {
        this.ganado = ganadoData;
        if (ganadoData.fo_ganado) {
          this.ganadoURL = `${environment.url}/${ganadoData.fo_ganado}`;
        } else {
          this.ganadoURL = null;
        }
        this.ganadoForm = new FormGroup({
          idRaza: new FormControl(ganadoData.id_raza, {
            validators: [Validators.required]
          }),
          tipoGanado: new FormControl(`${ganadoData.id_tipo_ganado}`, {
            validators: [Validators.required]
          }),
          idEstadoGanado: new FormControl(`${ganadoData.id_estado_ganado}`, {
            validators: [Validators.required]
          }),
          date: new FormControl(new Date(ganadoData.fe_ganado), {
            validators: [Validators.required]
          }),
          codigoGanado: new FormControl(ganadoData.co_ganado, {
            validators: [Validators.required, Validators.max(999999999)]
          }),
          pesoGanado: new FormControl(ganadoData.pe_ganado, {
            validators: [Validators.required]
          })
        });
        if (ganadoData.de_raza.toLowerCase() === 'mestizo') {
          this.ganadoForm.patchValue({ idRaza: 'Mestizo' });
        }
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

  onFileSelect(file: File) {
    this.fotoGanado = file;

    const mimeType = file.type;
    if (file.type !== 'image/jpg' && file.type !== 'image/jpeg' && file.type !== 'image/png') {
      this.dialogService.openSimpleDialog(
        'Error',
        'El formato de la foto es invalido, solo se permiten jpg, jpeg y png',
        () => {}
      );
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    // tslint:disable-next-line:variable-name
    reader.onload = _event => {
      this.ganadoURL = reader.result;
    };
  }

  goBack() {
    this.location.back();
  }

  onUpdate() {
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
    FD.set('newCoGanado', `${codigoGanado}`);
    FD.set('coGanado', `${this.ganado.co_ganado}`);
    if (this.fotoGanado) {
      FD.set('foGanado', this.fotoGanado);
    }
    this.dialogService.openConfirmDialog(
      'Confirmar',
      'Está seguro que desea modificar el ganado?',
      () => {
        this.isLoading = true;
        this.ganadoService.updateGanado(FD).subscribe(
          () => {
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    );
  }
}

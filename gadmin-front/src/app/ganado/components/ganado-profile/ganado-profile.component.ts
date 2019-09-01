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
        console.log(ganadoData);
        if (ganadoData.fo_ganado) {
          this.ganadoURL = `${environment.url}/${ganadoData.fo_ganado}`;
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
}

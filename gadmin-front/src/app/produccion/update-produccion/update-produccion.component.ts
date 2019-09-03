import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../auth/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Produccion } from '../models/produccion.model';
import { AuthService } from '../../services/auth.service';
import { RazaService } from '../../services/raza.service';
import { DialogService } from '../../services/dialog.service';
import { ProduccionService } from '../../services/produccion.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap, take } from 'rxjs/operators';

@Component({
  selector: 'app-update-produccion',
  templateUrl: './update-produccion.component.html',
  styleUrls: ['./update-produccion.component.scss']
})
export class UpdateProduccionComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  maxDate = new Date();
  produccionForm: FormGroup;
  producto: string;
  isLoading = false;
  produccion: Produccion;
  constructor(
    private authService: AuthService,
    private razaService: RazaService,
    private dialogService: DialogService,
    private produccionService: ProduccionService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          this.producto = paramMap.get('producto');
          return this.produccionService.getProduccion(paramMap.get('idProduccion'));
        }),
        take(1)
      )
      .subscribe(produccionData => {
        this.produccion = produccionData;
        if (this.producto === 'queso') {
          this.produccionForm = new FormGroup({
            caProduccion: new FormControl(produccionData.ca_produccion, {
              validators: [Validators.required]
            }),
            date: new FormControl(new Date(produccionData.fe_produccion), {
              validators: [Validators.required]
            })
          });
        } else {
          this.produccionForm = new FormGroup({
            caProduccion: new FormControl(produccionData.ca_produccion, {
              validators: [Validators.required]
            }),
            date: new FormControl(new Date(produccionData.fe_produccion), {
              validators: [Validators.required]
            }),
            idTipoProduccion: new FormControl(`${produccionData.id_tipo_produccion}`, {
              validators: [Validators.required]
            })
          });
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
  onUpdate() {
    if (this.produccionForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    const caProduccion = +this.produccionForm.value.caProduccion;
    const date: Date = this.produccionForm.value.date;
    if (typeof caProduccion !== 'number') {
      this.dialogService.openSimpleDialog(
        'Error',
        'La cantidad de producción debe de ser un número',
        () => {}
      );
      return;
    }
    const feProduccion = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    let idTipoProduccion;
    if (this.producto === 'leche') {
      idTipoProduccion = +this.produccionForm.value.idTipoProduccion;
    } else {
      idTipoProduccion = 3;
    }
    if (idTipoProduccion !== 3 && idTipoProduccion !== 2 && idTipoProduccion !== 1) {
      this.dialogService.openSimpleDialog('Error', 'El tipo de producción es incorrecto', () => {});
      return;
    }
    const updatedProduccion = {
      feProduccion,
      caProduccion,
      idEmpresa: this.empresa.id_empresa,
      idTipoProduccion,
      idProduccion: this.produccion.id_produccion
    };
    this.isLoading = true;
    this.produccionService.updateProduccion(updatedProduccion, this.producto).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

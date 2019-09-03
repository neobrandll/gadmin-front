import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../auth/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { RazaService } from '../../services/raza.service';
import { DialogService } from '../../services/dialog.service';
import { ProduccionService } from '../../services/produccion.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-create-produccion',
  templateUrl: './create-produccion.component.html',
  styleUrls: ['./create-produccion.component.scss']
})
export class CreateProduccionComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  maxDate = new Date();
  produccionForm: FormGroup;
  producto: string;
  isLoading = false;
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
    this.route.paramMap.subscribe(paramMap => {
      this.producto = paramMap.get('producto');
      if (this.producto === 'queso') {
        this.produccionForm = new FormGroup({
          caProduccion: new FormControl(null, {
            validators: [Validators.required]
          }),
          date: new FormControl(null, {
            validators: [Validators.required]
          })
        });
      } else {
        this.produccionForm = new FormGroup({
          caProduccion: new FormControl(null, {
            validators: [Validators.required]
          }),
          date: new FormControl(null, {
            validators: [Validators.required]
          }),
          idTipoProduccion: new FormControl('1', {
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
  onCreate() {
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
    const newProduccion = {
      feProduccion,
      caProduccion,
      idEmpresa: this.empresa.id_empresa,
      idTipoProduccion
    };
    this.isLoading = true;
    this.produccionService.createProduccion(newProduccion, this.producto).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

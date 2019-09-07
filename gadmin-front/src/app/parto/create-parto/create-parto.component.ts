import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaLogin, User } from '../../auth/models/user.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';
import { PartoService } from '../../services/parto.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../services/dialog.service';
import { MatSelectChange, MatTableDataSource } from '@angular/material';
import { Cria } from '../models/parto.model';

@Component({
  selector: 'app-create-parto',
  templateUrl: './create-parto.component.html',
  styleUrls: ['./create-parto.component.scss']
})
export class CreatePartoComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  isLoading = false;
  partoForm: FormGroup;
  criaForm: FormGroup;
  maxDate = new Date();
  displayedColumns: string[] = ['coGanado', 'tipoGanado', 'peGanado', 'delete'];
  dataSource: any;
  ELEMENT_DATA: Cria[] = [];
  constructor(
    private authService: AuthService,
    private partoService: PartoService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.partoForm = new FormGroup({
      coMaGanado: new FormControl(null, {
        validators: [Validators.required, Validators.max(999999999)]
      }),
      idTipoActividad: new FormControl(1, {
        validators: [Validators.required]
      }),
      date: new FormControl(null, {
        validators: [Validators.required]
      }),
      deActividad: new FormControl(null, {
        validators: [Validators.required]
      }),
      coPaGanado: new FormControl(null, {
        validators: [Validators.max(999999999)]
      })
    });
    this.criaForm = new FormGroup({
      coGanado: new FormControl(null, {
        validators: [Validators.required, Validators.max(999999999)]
      }),
      peGanado: new FormControl(null, {
        validators: [Validators.required]
      }),
      tipoGanado: new FormControl(null, {
        validators: [Validators.required]
      })
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

  removeCria(criaData: Cria) {
    this.ELEMENT_DATA = this.ELEMENT_DATA.filter(cria => cria.coGanado !== criaData.coGanado);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    if (this.criaForm.disabled) {
      this.criaForm.enable();
    }
  }

  addCria() {
    if (this.criaForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    if (this.ELEMENT_DATA.length >= 3) {
      this.dialogService.openSimpleDialog('Error', 'Maximo 3 crias por parto', () => {});
      return;
    }
    const tipoGanado = +this.criaForm.value.tipoGanado;
    const peGanado = this.criaForm.value.peGanado;
    const coGanado = this.criaForm.value.coGanado;
    const coMaGanado = this.partoForm.value.coMaGanado;
    const coPaGanado = this.partoForm.value.coPaGanado;
    if (coMaGanado && coMaGanado === coGanado) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la cria y la madre no pueden ser el mismo',
        () => {}
      );
      return;
    }
    if (coPaGanado && coPaGanado === coGanado) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la cria y el del padre no pueden ser el mismo',
        () => {}
      );
      return;
    }
    if (!Number.isInteger(coGanado)) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la cria debe de ser un número entero',
        () => {}
      );
      return;
    }
    if (typeof peGanado !== 'number') {
      this.dialogService.openSimpleDialog(
        'Error',
        'El peso de la cria debe de ser un número',
        () => {}
      );
      return;
    }
    if (+tipoGanado !== 1 && +tipoGanado !== 2) {
      this.dialogService.openSimpleDialog('Error', 'El tipo de ganado es incorrecto', () => {});
      return;
    }
    if (this.ELEMENT_DATA.length > 0) {
      const isRepeated = this.ELEMENT_DATA.some(cria => cria.coGanado === coGanado);
      if (isRepeated) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código de la cria introducido ya existe en el parto',
          () => {}
        );
        return;
      }
    }
    const newCria = { tipoGanado, peGanado, coGanado };
    this.ELEMENT_DATA.push(newCria);
    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
    this.criaForm.reset();
    if (this.ELEMENT_DATA.length >= 3) {
      this.criaForm.disable();
    }
  }

  onCreate() {
    if (this.partoForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    const deActividad = this.partoForm.value.deActividad;
    const date = this.partoForm.value.date;
    const feActividad = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const newParto = { feActividad, idEmpresa: this.empresa.id_empresa, deActividad };
    if (this.ELEMENT_DATA.length <= 0) {
      this.dialogService.openSimpleDialog(
        'Error',
        'Se necesita al menos una cria para registar el parto',
        () => {}
      );
      return;
    }
    // @ts-ignore
    newParto.crias = this.ELEMENT_DATA;
    const coMaGanado = this.partoForm.value.coMaGanado;
    const idTipoActividad = +this.partoForm.value.idTipoActividad;
    if (idTipoActividad !== 1 && idTipoActividad !== 2) {
      this.dialogService.openSimpleDialog('Error', 'Tipo de parto invalido', () => {});
      return;
    }
    // @ts-ignore
    newParto.idTipoActividad = idTipoActividad;
    if (!Number.isInteger(coMaGanado)) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la madre debe de ser un número entero',
        () => {}
      );
      return;
    }
    // @ts-ignore
    newParto.coMaGanado = coMaGanado;
    const coMaGanadoRepeated = this.ELEMENT_DATA.some(cria => cria.coGanado === coMaGanado);
    if (coMaGanadoRepeated) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la madre es igual al de una cria',
        () => {}
      );
      return;
    }
    if (this.partoForm.contains('coPaPajuela')) {
      const coPaPajuela = this.partoForm.value.coPaPajuela;
      if (!Number.isInteger(coPaPajuela)) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código de la pajuela debe de ser un número entero',
          () => {}
        );
        return;
      }
      // @ts-ignore
      newParto.coPaPajuela = coPaPajuela;
    }
    if (this.partoForm.contains('coPaGanado')) {
      const coPaGanado = this.partoForm.value.coPaGanado;
      if (!Number.isInteger(coPaGanado)) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código del padre debe de ser un número entero',
          () => {}
        );
        return;
      }
      const coPaGanadoRepeated = this.ELEMENT_DATA.some(cria => cria.coGanado === coPaGanado);
      if (coPaGanadoRepeated) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código del padre es igual al de una cria',
          () => {}
        );
        return;
      }
      if (coPaGanado === coMaGanado) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código del padre es igual al de la madre',
          () => {}
        );
        return;
      }
      // @ts-ignore
      newParto.coPaGanado = coPaGanado;
    }
    this.isLoading = true;
    // @ts-ignore
    this.partoService.createParto(newParto).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }

  onSelectionChange(event: MatSelectChange) {
    const value = +event.value;
    if (value === 2) {
      if (this.partoForm.contains('coPaGanado')) {
        this.partoForm.removeControl('coPaGanado');
      }
      if (!this.partoForm.contains('coPaPajuela')) {
        this.partoForm.addControl(
          'coPaPajuela',
          new FormControl(null, { validators: [Validators.max(999999999)] })
        );
      }
    }
    if (value === 1) {
      if (this.partoForm.contains('coPaPajuela')) {
        this.partoForm.removeControl('coPaPajuela');
      }
      if (!this.partoForm.contains('coPaGanado')) {
        this.partoForm.addControl(
          'coPaGanado',
          new FormControl(null, { validators: [Validators.max(999999999)] })
        );
      }
    }
  }
}

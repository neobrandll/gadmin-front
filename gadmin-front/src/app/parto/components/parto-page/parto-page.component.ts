import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { SearchParto } from '../../models/parto.model';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { PartoService } from '../../../services/parto.service';
import { take } from 'rxjs/operators';
import { DialogService } from '../../../services/dialog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-parto-page',
  templateUrl: './parto-page.component.html',
  styleUrls: ['./parto-page.component.scss']
})
export class PartoPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  maxDate = new Date();
  ELEMENT_DATA: SearchParto[];
  dataSource: any;
  displayedColumns: string[] = [
    'nu_crias',
    'de_actividad',
    'id_tipo_actividad',
    'co_ma_ganado',
    'co_pa_ganado',
    'co_pa_pajuela',
    'fe_actividad'
  ];
  deActividad: string;
  idTipoActividad: string;
  dateFrom: any;
  dateTo: any;
  coMadre: number;
  coPadre: number;
  coPajuela: number;
  constructor(
    private authService: AuthService,
    private partoService: PartoService,
    private dialogService: DialogService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.partoService
      .searchParto()
      .pipe(take(1))
      .subscribe(partoResponse => {
        this.ELEMENT_DATA = partoResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
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

  getDate(date: string) {
    return new Date(date);
  }

  onFilter() {
    const filterParams = {};
    if (this.dateFrom) {
      // @ts-ignore
      filterParams.dateFrom = `${this.dateFrom.getMonth() +
        1}-${this.dateFrom.getDate()}-${this.dateFrom.getFullYear()}`;
    }
    if (this.dateTo) {
      // @ts-ignore
      filterParams.dateTo = `${this.dateTo.getMonth() +
        1}-${this.dateTo.getDate()}-${this.dateTo.getFullYear()}`;
    }
    if (this.idTipoActividad) {
      // @ts-ignore
      filterParams.idTipoActividad = this.idTipoActividad;
    }
    if (this.deActividad) {
      // @ts-ignore
      filterParams.filter = this.deActividad;
    }
    if (this.coMadre) {
      if (!Number.isInteger(this.coMadre)) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código de la madre debe de ser un número entero',
          () => {}
        );
        return;
      }
      // @ts-ignore
      filterParams.coMaGanado = this.coMadre;
    }
    if (this.coPadre) {
      if (!Number.isInteger(this.coPadre)) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código del padre debe de ser un número entero',
          () => {}
        );
        return;
      }
      if (+this.idTipoActividad === 2) {
        this.dialogService.openSimpleDialog(
          'Error',
          'Se introdujo el código del padre y el tipo de parto es con pajuela',
          () => {}
        );
        return;
      }
      if (this.coPajuela) {
        this.dialogService.openSimpleDialog(
          'Error',
          'Se introdujo el código de una pajuela y el codigo de un padre y solo se permite uno de los dos',
          () => {}
        );
        return;
      }
      // @ts-ignore
      filterParams.coPaGanado = this.coPadre;
    }
    if (this.coPajuela) {
      if (!Number.isInteger(this.coPajuela)) {
        this.dialogService.openSimpleDialog(
          'Error',
          'El código de la pajuela debe de ser un número entero',
          () => {}
        );
        return;
      }
      if (this.coPadre) {
        this.dialogService.openSimpleDialog(
          'Error',
          'Se introdujo el codigo de una pajuela y el codigo de un padre y solo se permite uno de los dos',
          () => {}
        );
        return;
      }
      if (+this.idTipoActividad === 1) {
        this.dialogService.openSimpleDialog(
          'Error',
          'Se introdujo el código de una pajuela y el tipo de parto es natural',
          () => {}
        );
        return;
      }
      // @ts-ignore
      filterParams.coPaPajuela = this.coPajuela;
    }
    this.partoService
      .searchParto(filterParams)
      .pipe(take(1))
      .subscribe(partoResponse => {
        this.ELEMENT_DATA = partoResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.dateFrom = null;
    this.dateTo = null;
  }

  getParto(parto: SearchParto) {
    this.router.navigate(['parto', parto.id_actividad]);
  }
}

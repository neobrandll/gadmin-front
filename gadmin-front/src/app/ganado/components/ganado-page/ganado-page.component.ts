import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { GanadoService } from '../../../services/ganado.service';
import { take } from 'rxjs/operators';
import { Raza } from '../../../raza/models/raza.model';
import { SearchGanadoResultSet } from '../../models/ganado.model';
import { MatPaginator, MatTableDataSource, MatSort } from '@angular/material';
import { RazaService } from '../../../services/raza.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-ganado-page',
  templateUrl: './ganado-page.component.html',
  styleUrls: ['./ganado-page.component.scss']
})
export class GanadoPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  ELEMENT_DATA: SearchGanadoResultSet[];
  dataSource: any;
  displayedColumns: string[] = [
    'co_ganado',
    'de_tipo_ganado',
    'de_raza',
    'fe_ganado',
    'de_estado_ganado'
  ];
  razas: Raza[];
  maxDate = new Date();
  dateFrom: any;
  dateTo: any;
  idRaza: number;
  tipoGanado: number;
  idEstadoGanado: number;

  constructor(
    private authService: AuthService,
    private ganadoService: GanadoService,
    private razaService: RazaService,
    private router: Router
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.ganadoService
      .searchGanado()
      .pipe(take(1))
      .subscribe(ganadoResponse => {
        this.ELEMENT_DATA = ganadoResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.razaService
      .getRazas()
      .pipe(take(1))
      .subscribe(rs => {
        this.razas = rs.razas;
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
    if (this.idRaza) {
      // @ts-ignore
      filterParams.idRaza = this.idRaza;
    }
    if (this.idEstadoGanado) {
      // @ts-ignore
      filterParams.idEstadoGanado = this.idEstadoGanado;
    }
    if (this.tipoGanado) {
      // @ts-ignore
      filterParams.tipoGanado = this.tipoGanado;
    }
    this.ganadoService
      .searchGanado(filterParams)
      .pipe(take(1))
      .subscribe(ganadoResponse => {
        this.ELEMENT_DATA = ganadoResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.dateFrom = null;
    this.dateTo = null;
  }

  goToProfile(ganadoData: SearchGanadoResultSet) {
    this.router.navigate(['/ganado', ganadoData.co_ganado]);
  }
}

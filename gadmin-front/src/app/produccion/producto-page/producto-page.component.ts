import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../auth/models/user.model';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DialogService } from '../../services/dialog.service';
import { switchMap, take } from 'rxjs/operators';
import { Produccion } from '../models/produccion.model';
import { ProduccionService } from '../../services/produccion.service';

@Component({
  selector: 'app-producto-page',
  templateUrl: './producto-page.component.html',
  styleUrls: ['./producto-page.component.scss']
})
export class ProductoPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  ELEMENT_DATA: Produccion[];
  dataSource: any;
  displayedColumns: string[] = ['de_tipo_produccion', 'ca_produccion', 'fe_produccion'];
  maxDate = new Date();
  dateFrom: any;
  dateTo: any;
  producto: string;
  idTipoProduccion: string;
  constructor(
    private authService: AuthService,
    private router: Router,
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
          return this.produccionService.searchProduccion(paramMap.get('producto'));
        }),
        take(1)
      )
      .subscribe(produccionResponse => {
        this.ELEMENT_DATA = produccionResponse;
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
    if (this.idTipoProduccion) {
      // @ts-ignore
      filterParams.idTipoProduccion = this.idTipoProduccion;
    }
    this.produccionService
      .searchProduccion(this.producto, filterParams)
      .pipe(take(1))
      .subscribe(produccionResponse => {
        this.ELEMENT_DATA = produccionResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.dateFrom = null;
    this.dateTo = null;
  }

  goToProduccion(produccionData: Produccion) {
    this.router.navigate(['/produccion/update', this.producto, produccionData.id_produccion]);
  }
}

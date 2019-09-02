import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { Raza } from '../../../raza/models/raza.model';
import { AuthService } from '../../../services/auth.service';
import { RazaService } from '../../../services/raza.service';
import { Router } from '@angular/router';
import { DialogService } from '../../../services/dialog.service';
import { take } from 'rxjs/operators';
import { PajuelaService } from '../../../services/pajuela.service';
import { Pajuela } from '../../models/pajuela.model';

@Component({
  selector: 'app-pajuela-page',
  templateUrl: './pajuela-page.component.html',
  styleUrls: ['./pajuela-page.component.scss']
})
export class PajuelaPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  // @ts-ignore
  @ViewChild(MatSort) sort: MatSort;
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  ELEMENT_DATA: Pajuela[];
  dataSource: any;
  displayedColumns: string[] = ['co_pajuela', 'de_pajuela', 'de_raza', 'fe_pajuela'];
  razas: Raza[];
  maxDate = new Date();
  dateFrom: any;
  dateTo: any;
  idRaza: number;
  dePajuela: string;
  individualPajuela: number;
  constructor(
    private authService: AuthService,
    private razaService: RazaService,
    private router: Router,
    private dialogService: DialogService,
    private pajuelaService: PajuelaService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.pajuelaService
      .searchPajuela()
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
    if (this.dePajuela) {
      // @ts-ignore
      filterParams.filter = this.dePajuela;
    }
    this.pajuelaService
      .searchPajuela(filterParams)
      .pipe(take(1))
      .subscribe(pajuelaResponse => {
        this.ELEMENT_DATA = pajuelaResponse;
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    this.dateFrom = null;
    this.dateTo = null;
  }

  goToProfile(pajuelaData: Pajuela) {
    this.router.navigate(['/pajuela/update', pajuelaData.co_pajuela]);
  }

  goToIndividualProfile() {
    if (!Number.isInteger(this.individualPajuela)) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la pajuela debe de ser un número entero',
        () => {}
      );
      return;
    }
    this.router.navigate(['/pajuela/update', this.individualPajuela]);
  }
}

import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { EmpresaService } from '../../../services/empresa.service';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { RazaService } from '../../../services/raza.service';
import { Raza } from '../../models/raza.model';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-raza-page',
  templateUrl: './raza-page.component.html',
  styleUrls: ['./raza-page.component.scss']
})
export class RazaPageComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  empresa: EmpresaLogin;
  user: User;
  userSub: Subscription;
  razaSub: Subscription;
  empresaSub: Subscription;
  ELEMENT_DATA: Raza[];
  dataSource: any;
  displayedColumns: string[] = ['de_raza'];

  constructor(
    private authService: AuthService,
    private razaService: RazaService,
    private router: Router,
    private location: Location
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.razaSub = this.razaService.getRazas().subscribe(razaResponse => {
      this.ELEMENT_DATA = razaResponse.razas;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }

  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
    if (this.empresaSub) {
      this.empresaSub.unsubscribe();
    }
    if (this.razaSub) {
      this.razaSub.unsubscribe();
    }
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  updateRaza(raza: Raza) {
    this.router.navigate(['/raza/update', raza.id_raza]);
  }
  goBack() {
    this.location.back();
  }
}

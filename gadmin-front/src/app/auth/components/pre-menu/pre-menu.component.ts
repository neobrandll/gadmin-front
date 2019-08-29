import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EmpresaLogin, User } from '../../models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { MatTableDataSource, MatPaginator } from '@angular/material';

@Component({
  selector: 'app-pre-menu',
  templateUrl: './pre-menu.component.html',
  styleUrls: ['./pre-menu.component.scss']
})
export class PreMenuComponent implements OnInit, OnDestroy {
  // @ts-ignore
  @ViewChild(MatPaginator) paginator: MatPaginator;
  user: User;
  userSub: Subscription;
  ELEMENT_DATA: EmpresaLogin[];
  dataSource: any;
  displayedColumns: string[] = ['no_empresa', 'ri_empresa'];

  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      if (!user) {
        return;
      }
      this.user = user;
      this.ELEMENT_DATA = user.empresas;
      this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
      this.dataSource.paginator = this.paginator;
    });
  }
  ngOnDestroy(): void {
    if (this.userSub) {
      this.userSub.unsubscribe();
    }
  }

  onLogout() {
    this.authService.logout();
  }

  onEmpresaSelected(empresa: EmpresaLogin) {
    console.log(empresa);
  }

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}

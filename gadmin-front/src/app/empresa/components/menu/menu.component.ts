import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AdminService, PerfilesyPermisos } from '../../../services/admin.service';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../services/empresa.service';
import { switchMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit, OnDestroy {
  user: User;
  empresa: EmpresaLogin;
  userSub: Subscription;
  empresaSub: Subscription;
  perfilesyPermisos: PerfilesyPermisos;
  constructor(
    private route: ActivatedRoute,
    private adminService: AdminService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa
      .pipe(
        switchMap(empresaData => {
          this.empresa = empresaData;
          return this.adminService.getPerfilesyPermisos(this.empresa.id_empresa);
        })
      )
      .subscribe(pyP => {
        this.perfilesyPermisos = pyP;
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
}

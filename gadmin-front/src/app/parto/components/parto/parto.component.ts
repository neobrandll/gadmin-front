import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { Cria, Parto } from '../../models/parto.model';
import { PartoService } from '../../../services/parto.service';
import { ActivatedRoute } from '@angular/router';
import { switchMap } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material';

@Component({
  selector: 'app-parto',
  templateUrl: './parto.component.html',
  styleUrls: ['./parto.component.scss']
})
export class PartoComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  parto: Parto;
  isLoading = false;
  ELEMENT_DATA: Cria[] = [];
  displayedColumns: string[] = ['coGanado', 'deTipoGanado', 'peGanado'];
  dataSource: any;
  constructor(
    private authService: AuthService,
    private partoService: PartoService,
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
          this.isLoading = true;
          return this.partoService.getParto(+paramMap.get('idParto'));
        })
      )
      .subscribe(partoData => {
        this.parto = partoData;
        this.ELEMENT_DATA = partoData.crias.map(cria => {
          return {
            coGanado: cria.co_ganado,
            deTipoGanado: cria.de_tipo_ganado,
            peGanado: cria.pe_ganado
          };
        });
        this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
        this.isLoading = false;
      });
  }

  getDate(date: string) {
    return new Date(date);
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

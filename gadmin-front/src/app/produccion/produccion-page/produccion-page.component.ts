import { Component, OnDestroy, OnInit } from '@angular/core';
import { EmpresaLogin, User } from '../../auth/models/user.model';
import { AuthService } from '../../services/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-produccion-page',
  templateUrl: './produccion-page.component.html',
  styleUrls: ['./produccion-page.component.scss']
})
export class ProduccionPageComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
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

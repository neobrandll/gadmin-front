import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from '../../../services/dialog.service';
import { RazaService } from '../../../services/raza.service';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-update-raza',
  templateUrl: './update-raza.component.html',
  styleUrls: ['./update-raza.component.scss']
})
export class UpdateRazaComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  razaForm: FormGroup;
  idRaza: number;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private razaService: RazaService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.idRaza = this.route.snapshot.params.idRaza;
    this.razaService
      .getRaza(this.idRaza)
      .pipe(take(1))
      .subscribe(raza => {
        this.razaForm = new FormGroup({
          deRaza: new FormControl(raza.de_raza, {
            validators: [Validators.required]
          })
        });
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

  onUpdate() {
    const deRaza = this.razaForm.value.deRaza.trim();
    if (deRaza === '') {
      this.dialogService.openSimpleDialog('Error', `Los campos no pueden estar vacios`, () => {});
      return;
    }
    if (!this.razaForm.valid) {
      return;
    }

    this.dialogService.openConfirmDialog(
      'Confirmar',
      'Está seguro que desea modificar la raza?',
      () => {
        this.isLoading = true;
        this.razaService.updateRaza(deRaza, this.empresa.id_empresa, this.idRaza).subscribe(
          () => {
            this.isLoading = false;
          },
          () => {
            this.isLoading = false;
          }
        );
      }
    );
  }
}

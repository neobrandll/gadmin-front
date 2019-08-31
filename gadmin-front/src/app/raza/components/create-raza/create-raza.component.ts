import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { DialogService } from '../../../services/dialog.service';
import { RazaService } from '../../../services/raza.service';

@Component({
  selector: 'app-create-raza',
  templateUrl: './create-raza.component.html',
  styleUrls: ['./create-raza.component.scss']
})
export class CreateRazaComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  razaForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private dialogService: DialogService,
    private razaService: RazaService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      this.user = user;
    });
    this.empresaSub = this.authService.empresa.subscribe(empresaData => {
      this.empresa = empresaData;
    });
    this.razaForm = new FormGroup({
      deRaza: new FormControl(null, {
        validators: [Validators.required]
      })
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

  onCreate() {
    const deRaza = this.razaForm.value.deRaza.trim();
    if (deRaza === '') {
      this.dialogService.openSimpleDialog('Error', `Los campos no pueden estar vacios`, () => {});
      return;
    }
    if (!this.razaForm.valid) {
      return;
    }
    this.isLoading = true;
    this.razaService.createRaza(deRaza, this.empresa.id_empresa).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

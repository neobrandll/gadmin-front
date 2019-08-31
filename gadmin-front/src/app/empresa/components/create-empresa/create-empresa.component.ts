import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';
import { Subscription } from 'rxjs';
import { EmpresaService } from '../../../services/empresa.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-create-empresa',
  templateUrl: './create-empresa.component.html',
  styleUrls: ['./create-empresa.component.scss']
})
export class CreateEmpresaComponent implements OnInit, OnDestroy {
  user: User;
  addressForm: FormGroup;
  empresaInfoForm: FormGroup;
  userSub: Subscription;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private empresaService: EmpresaService,
    private dialogService: DialogService
  ) {}

  ngOnInit() {
    this.userSub = this.authService.user.subscribe(user => {
      if (user) {
        this.user = user;
      }
    });
    this.addressForm = new FormGroup({
      pais: new FormControl(null, {
        validators: [Validators.required]
      }),
      estado: new FormControl(null, {
        validators: [Validators.required]
      }),
      ciudad: new FormControl(null, {
        validators: [Validators.required]
      }),
      calle: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.empresaInfoForm = new FormGroup({
      rif: new FormControl(null, {
        validators: [Validators.required]
      }),
      nombre: new FormControl(null, {
        validators: [Validators.required]
      })
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
  onCreateEmpresa() {
    const nombreEmpresa = this.empresaInfoForm.value.nombre.trim();
    const rifEmpresa = this.empresaInfoForm.value.rif;
    const pais = this.addressForm.value.pais.trim();
    const estado = this.addressForm.value.estado.trim();
    const ciudad = this.addressForm.value.ciudad.trim();
    const calle = this.addressForm.value.calle.trim();
    if (nombreEmpresa === '' || pais === '' || estado === '' || ciudad === '' || calle === '') {
      this.dialogService.openSimpleDialog('Error', `Los campos no pueden estar vacios`, () => {});
      return;
    }
    const newEmpresa = {
      nombreEmpresa,
      rifEmpresa,
      pais,
      estado,
      ciudad,
      calle
    };
    this.isLoading = true;
    this.empresaService
      .createEmpresa(newEmpresa)
      .subscribe(() => (this.isLoading = false), () => (this.isLoading = false));
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { Raza } from '../../../raza/models/raza.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RazaService } from '../../../services/raza.service';
import { DialogService } from '../../../services/dialog.service';
import { take } from 'rxjs/operators';
import { PajuelaService } from '../../../services/pajuela.service';

@Component({
  selector: 'app-create-pajuela',
  templateUrl: './create-pajuela.component.html',
  styleUrls: ['./create-pajuela.component.scss']
})
export class CreatePajuelaComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  razas: Raza[];
  maxDate = new Date();
  pajuelaForm: FormGroup;
  isLoading = false;
  constructor(
    private authService: AuthService,
    private razaService: RazaService,
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
    this.razaService
      .getRazas()
      .pipe(take(1))
      .subscribe(rs => {
        this.razas = rs.razas;
        this.pajuelaForm = new FormGroup({
          idRaza: new FormControl(null, {
            validators: [Validators.required]
          }),
          dePajuela: new FormControl(null, {
            validators: [Validators.required]
          }),
          date: new FormControl(null, {
            validators: [Validators.required]
          }),
          coPajuela: new FormControl(null, {
            validators: [Validators.required, Validators.max(999999999)]
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
  onCreate() {
    if (this.pajuelaForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    const coPajuela = this.pajuelaForm.value.coPajuela;
    const dePajuela = this.pajuelaForm.value.dePajuela;
    const date: Date = this.pajuelaForm.value.date;
    const idRaza = this.pajuelaForm.value.idRaza;
    if (!coPajuela || !Number.isInteger(coPajuela)) {
      this.dialogService.openSimpleDialog(
        'Error',
        'El código de la pajuela debe de ser un número entero',
        () => {}
      );
      return;
    }
    if (typeof dePajuela !== 'string') {
      this.dialogService.openSimpleDialog(
        'Error',
        'La descripción de la pajuela debe de ser tipo string',
        () => {}
      );
      return;
    }
    const fePajuela = `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
    const newPajuela = {
      fePajuela,
      coPajuela,
      idEmpresa: this.empresa.id_empresa,
      dePajuela,
      idRaza
    };
    this.isLoading = true;
    this.pajuelaService.createPajuela(newPajuela).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

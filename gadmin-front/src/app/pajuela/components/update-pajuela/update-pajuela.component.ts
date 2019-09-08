import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { EmpresaLogin, User } from '../../../auth/models/user.model';
import { Raza } from '../../../raza/models/raza.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { RazaService } from '../../../services/raza.service';
import { DialogService } from '../../../services/dialog.service';
import { PajuelaService } from '../../../services/pajuela.service';
import { Pajuela } from '../../models/pajuela.model';
import { switchMap, take } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-update-pajuela',
  templateUrl: './update-pajuela.component.html',
  styleUrls: ['./update-pajuela.component.scss']
})
export class UpdatePajuelaComponent implements OnInit, OnDestroy {
  userSub: Subscription;
  empresaSub: Subscription;
  user: User;
  empresa: EmpresaLogin;
  razas: Raza[];
  maxDate = new Date();
  pajuelaForm: FormGroup;
  isLoading = false;
  pajuela: Pajuela;

  constructor(
    private authService: AuthService,
    private razaService: RazaService,
    private dialogService: DialogService,
    private pajuelaService: PajuelaService,
    private route: ActivatedRoute,
    private location: Location
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
      });
    this.route.paramMap
      .pipe(
        switchMap(paramMap => {
          return this.pajuelaService.getPajuela(+paramMap.get('coPajuela'));
        })
      )
      .subscribe(pajuelaData => {
        this.pajuela = pajuelaData;
        this.pajuelaForm = new FormGroup({
          idRaza: new FormControl(pajuelaData.id_raza, {
            validators: [Validators.required]
          }),
          dePajuela: new FormControl(`${pajuelaData.de_pajuela}`, {
            validators: [Validators.required]
          }),
          date: new FormControl(new Date(pajuelaData.fe_pajuela), {
            validators: [Validators.required]
          }),
          coPajuela: new FormControl(pajuelaData.co_pajuela, {
            validators: [Validators.required, Validators.max(999999999)]
          })
        });
        if (pajuelaData.de_raza.toLowerCase() === 'mestizo') {
          this.pajuelaForm.patchValue({ idRaza: 'Mestizo' });
        }
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
    if (this.pajuelaForm.invalid) {
      this.dialogService.openSimpleDialog('Error', 'Todos los campos son necesarios', () => {});
      return;
    }
    const newCoPajuela = this.pajuelaForm.value.coPajuela;
    const dePajuela = this.pajuelaForm.value.dePajuela;
    const date: Date = this.pajuelaForm.value.date;
    const idRaza = this.pajuelaForm.value.idRaza;
    if (!newCoPajuela || !Number.isInteger(newCoPajuela)) {
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
      coPajuela: this.pajuela.co_pajuela,
      idEmpresa: this.empresa.id_empresa,
      dePajuela,
      idRaza,
      newCoPajuela
    };

    this.dialogService.openConfirmDialog(
      'Confirmar',
      'Está seguro que desea modificar la pajuela?',
      () => {
        this.isLoading = true;
        this.pajuelaService.updatePajuela(newPajuela).subscribe(
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

  goBack() {
    this.location.back();
  }
}

import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { DialogService } from '../../../services/dialog.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  pwdMatch = false;
  infoForm: FormGroup;
  userForm: FormGroup;
  isLoading = false;
  hideP = true;
  hideCp = true;

  constructor(private authService: AuthService, private dialogService: DialogService) {}

  ngOnInit() {
    this.form = new FormGroup({
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
    this.infoForm = new FormGroup({
      nombre: new FormControl(null, {
        validators: [Validators.required]
      }),
      apellido: new FormControl(null, {
        validators: [Validators.required]
      }),
      telefono: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required, Validators.email]
      }),
      cedula: new FormControl(null, {
        validators: [Validators.required]
      })
    });
    this.userForm = new FormGroup(
      {
        user: new FormControl(null, {
          validators: [Validators.required]
        }),
        password: new FormControl(null, {
          validators: [Validators.required, Validators.minLength(5)]
        }),
        passwordConfirm: new FormControl(null, {
          validators: [Validators.required]
        })
      },
      this.passwordMatchValidator
    );
  }

  passwordMatchValidator = (g: FormGroup) => {
    if (g.get('password').value === g.get('passwordConfirm').value) {
      this.pwdMatch = true;
      return null;
    } else {
      this.pwdMatch = false;
      if (g.get('passwordConfirm').dirty) {
        g.controls.passwordConfirm.setErrors({ mismatch: true });
      }
      return { mismatch: true };
    }
  };

  onRegister() {
    if (!this.form.valid || !this.userForm.valid || !this.infoForm.valid) {
      return;
    }
    const nombre = this.infoForm.value.nombre.trim();
    const apellido = this.infoForm.value.apellido.trim();
    const email = this.infoForm.value.email.trim();
    const password = this.userForm.value.password.trim();
    const confirmPassword = this.userForm.value.passwordConfirm.trim();
    const user = this.userForm.value.user.trim();
    const pais = this.form.value.pais.trim();
    const estado = this.form.value.estado.trim();
    const ciudad = this.form.value.ciudad.trim();
    const calle = this.form.value.calle.trim();
    if (
      nombre === '' ||
      apellido === '' ||
      email === '' ||
      password === '' ||
      confirmPassword === '' ||
      user === '' ||
      pais === '' ||
      estado === '' ||
      ciudad === '' ||
      calle === ''
    ) {
      this.dialogService.openSimpleDialog('Error', `Los campos no pueden estar vacios`, () => {});
      return;
    }
    this.isLoading = true;
    const registerData = {
      nombre,
      apellido,
      email,
      telf: this.infoForm.value.telefono,
      ci: +this.infoForm.value.cedula,
      password,
      confirmPassword,
      user,
      pais,
      estado,
      ciudad,
      calle
    };
    this.authService.register(registerData).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

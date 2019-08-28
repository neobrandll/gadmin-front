import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

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

  constructor(private authService: AuthService) {}

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
          validators: [Validators.required, Validators.minLength(5)]
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
      if (g.get('passwordConfirm').touched) {
        g.controls.passwordConfirm.setErrors({ mismatch: true });
      }
      return { mismatch: true };
    }
  };

  onRegister() {
    if (!this.form.valid || !this.userForm.valid || !this.infoForm.valid) {
      return;
    }
    this.isLoading = true;
    const registerData = {
      nombre: this.infoForm.value.nombre,
      apellido: this.infoForm.value.apellido,
      email: this.infoForm.value.email,
      telf: this.infoForm.value.telefono,
      ci: +this.infoForm.value.cedula,
      password: this.userForm.value.password,
      confirmPassword: this.userForm.value.passwordConfirm,
      user: this.userForm.value.user,
      pais: this.form.value.pais,
      estado: this.form.value.estado,
      ciudad: this.form.value.ciudad,
      calle: this.form.value.calle
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

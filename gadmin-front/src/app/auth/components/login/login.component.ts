import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  hide = true;
  constructor(private authService: AuthService) {}

  ngOnInit() {
    this.form = new FormGroup({
      user: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required, Validators.minLength(5)]
      })
    });
  }

  login() {
    if (!this.form.valid) {
      return;
    }
    const user = this.form.value.user;
    const password = this.form.value.password;
    this.isLoading = true;
    this.authService.login(user, password).subscribe(
      () => {
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
      }
    );
  }
}

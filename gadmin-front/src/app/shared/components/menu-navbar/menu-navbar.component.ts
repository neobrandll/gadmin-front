import { Component, Input, OnInit } from '@angular/core';
import { User } from '../../../auth/models/user.model';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-menu-navbar',
  templateUrl: './menu-navbar.component.html',
  styleUrls: ['./menu-navbar.component.scss']
})
export class MenuNavbarComponent implements OnInit {
  @Input() user: User;
  @Input() nombreEmpresa: string;
  constructor(private authService: AuthService) {}

  ngOnInit() {}

  onLogout() {
    this.authService.logout();
  }
}

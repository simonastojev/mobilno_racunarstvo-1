import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(public authService: AuthService, private router: Router, private menu: MenuController) {}

  openMenuForUser() {
    this.menu.enable(true, 'adminMenu');
    this.menu.open('adminMenu');
  }

  openMenuForAdmin() {
    this.menu.enable(true, 'secondMenu');
    this.menu.open('secondMenu');
  }

  onLogOut() {
    this.authService.logOut();
    this.router.navigateByUrl('/welcome');
  }
}

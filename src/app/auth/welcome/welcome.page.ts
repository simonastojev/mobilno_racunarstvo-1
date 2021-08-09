import { Component, OnInit } from '@angular/core';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements OnInit {

  constructor(private nav: NavController) { }

  ngOnInit() {
  }

  goToLoginPage(){
    this.nav.navigateForward(['log-in']);
  }

  goToRegisterPage(){
    this.nav.navigateForward(['register']);
  }

}

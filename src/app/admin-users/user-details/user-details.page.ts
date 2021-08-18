import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Users } from '../users.model';
import { UsersService } from '../users.service';

@Component({
  selector: 'app-user-details',
  templateUrl: './user-details.page.html',
  styleUrls: ['./user-details.page.scss'],
})
export class UserDetailsPage implements OnInit {

  user: Users;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private usersService: UsersService,
    private navCtrl: NavController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('userId')) {
        this.navCtrl.navigateBack('/admin-users');
        return;
      }

      this.isLoading = true;

      this.usersService
        .getUser(paramMap.get('userId'))
        .subscribe((user) => {
          this.user = user;
          this.isLoading = false;
        });
    });
    console.log(this.user);
  }

}

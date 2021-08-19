/* eslint-disable guard-for-in */
/* eslint-disable no-trailing-spaces */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { UserReservationsService } from '../performances/user-reservations.service';
import { UserReservation } from '../performances/userReservation.model';
import { Users } from './users.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})

export class AdminUsersPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  users: Users[];
  private usersSub: Subscription;



  constructor(private usersService: UsersService) {}

  ngOnInit() {
    this.usersSub = this.usersService.users.subscribe(users => {
      console.log(users);
      this.users = users;
    });
  }

  ionViewWillEnter() {
    this.usersService.getUsers().subscribe(users => {
    });
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }


}

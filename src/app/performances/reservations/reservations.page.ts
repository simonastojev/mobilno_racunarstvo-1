/* eslint-disable no-trailing-spaces */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { User } from 'src/app/auth/user.model';
import { PerformancesService } from '../performances.service';
import { UserReservationsService } from '../user-reservations.service';
import { UserReservation } from '../userReservation.model';

@Component({
  selector: 'app-reservations',
  templateUrl: './reservations.page.html',
  styleUrls: ['./reservations.page.scss'],
})
export class ReservationsPage implements OnInit, OnDestroy {

  userReservations: UserReservation[];
  performance: Performance;
  user: User;
  private sub: Subscription;

  constructor(private userReservationsService: UserReservationsService,
              private performancesService: PerformancesService,
              private authService: AuthService) {
                this.user = authService.currentUser;
               }

  ngOnInit() {
    this.sub = this.userReservationsService.userReservations.subscribe(userReservations => {
      this.userReservations = userReservations;
    });
  }

  ionViewWillEnter() {
    this.userReservationsService.getReservations(this.user.email).subscribe(userReservations => {
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

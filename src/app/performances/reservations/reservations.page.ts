/* eslint-disable no-trailing-spaces */
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
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
  private sub: Subscription;

  constructor(private userReservationsService: UserReservationsService,
              private performancesService: PerformancesService) { }

  ngOnInit() {
    this.sub = this.userReservationsService.userReservations.subscribe(userReservations => {
      this.userReservations = userReservations;
    });
  }

  ionViewWillEnter() {
    this.userReservationsService.getReservations().subscribe(userReservations => {
    });
  }

  ngOnDestroy() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
  }
}

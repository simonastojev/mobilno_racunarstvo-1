import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserReservationsService } from '../performances/user-reservations.service';
import { UserReservation } from '../performances/userReservation.model';

@Component({
  selector: 'app-admin-reservations',
  templateUrl: './admin-reservations.page.html',
  styleUrls: ['./admin-reservations.page.scss'],
})
export class AdminReservationsPage implements OnInit, OnDestroy {

  allReservations: UserReservation[];
  private reservationSub: Subscription;

  constructor(private userReservationsService: UserReservationsService) { }

  ngOnInit() {
    this.reservationSub = this.userReservationsService.allReservations.subscribe(allReservations => {
      this.allReservations = allReservations;
    });
  }

  ionViewWillEnter() {
    this.userReservationsService.getAllReservations().subscribe(allReservations => {
    });
  }

  ngOnDestroy() {
    if (this.reservationSub) {
      this.reservationSub.unsubscribe();
    }
  }

}

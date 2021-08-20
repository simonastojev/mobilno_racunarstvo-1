/* eslint-disable max-len */
/* eslint-disable arrow-body-style */
/* eslint-disable guard-for-in */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { Users } from '../admin-users/users.model';
import { AuthService } from '../auth/auth.service';
import { User } from '../auth/user.model';
import { Performance } from './performance.model';
import { UserReservation } from './userReservation.model';

interface UserReservationData {
  userId: string;
  performance: Performance;
  numberOfTickets: number;
}

@Injectable({
  providedIn: 'root'
})
export class UserReservationsService {

  private _userReservations = new BehaviorSubject<UserReservation[]>([]);
  private _allReservations = new BehaviorSubject<UserReservation[]>([]);

  constructor(private http: HttpClient, private authService: AuthService) { }

  get userReservations() {
    return this._userReservations.asObservable();
  }

  get allReservations() {
    return this._allReservations.asObservable();
  }

  getReservations(userId: string) {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{[key: string]: UserReservationData}>(
          `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/reservations.json?auth=${token}`
          );
        }), map((reservationData: any) => {
          const userReservations: UserReservation[] = [];
          for(const key in reservationData){
            if(reservationData.hasOwnProperty(key) && reservationData[key].userId === userId){
              userReservations.push(new UserReservation(key, reservationData[key].userId, reservationData[key].performance, reservationData[key].numberOfTickets)
              );
            }
          }
      return userReservations;
    }),
    tap(userReservations => {
      this._userReservations.next(userReservations);
    })
  );
  }

  reserveTickets(performance: Performance, numberOfTickets: number){
    let generatedId;
    let newUserReservation: UserReservation;
    const userId = this.authService.currentUser.email;

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        newUserReservation = new UserReservation(
          null,
          userId,
          performance,
          numberOfTickets
        );
      return this.http.post<{name: string}>(
        `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/reservations.json?auth=${token}`, newUserReservation);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.userReservations;
      }),
      take(1),
      tap((userReservations) => {
        newUserReservation.id = generatedId;
        this._userReservations.next(userReservations.concat(newUserReservation));
      })
    );
  }

  getAllReservations() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<{[key: string]: UserReservationData}>(
           `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/reservations.json?auth=${token}`
           );
        }), map((reservationData) => {
        const allReservations: UserReservation[] = [];

        for(const key in reservationData){

          if(reservationData.hasOwnProperty(key)){
            allReservations.push(new UserReservation(key, reservationData[key].userId, reservationData[key].performance, reservationData[key].numberOfTickets)
            );
          }
        }
      return allReservations;
    }),
    tap(allReservations => {
      this._allReservations.next(allReservations);
    })
  );
  }
}

/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Performance } from './performance.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';


interface PerformanceData {
  name: string;
  date: Date;
  place: string;
  price: number;
  actors: string;
  imageUrl: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformancesService {
  private _performances = new BehaviorSubject<Performance[]>([]);

  private oldPerformances: Performance[] = [
    {
      id: '1',
      name: 'Ujka Vanja - Čehov',
      date: new Date('Fri May 21 2021 19:00:00'),
      place: 'Velika scena - Ljuba Tadić',
      price: 1200,
      actors: `Nenad Jezdić, Mihail Lavovič, Milica Gojković, Marija Vicković,
              Bogdan Diklić, Aleksandra Nikolić, Dubravko Jovanović, Branislav Lečić`,
      imageUrl: 'https://www.jdp.rs/wp-content/uploads/2019/05/PLAKAT-Ujka-Vanja.jpg',
      userId: 'kjsks'
    },
    {
      id: '2',
      name: 'Pučina - Nušić',
      date: new Date('Tue May 11 2021 20:00:00'),
      place: 'Velika scena - Ljuba Tadić',
      price: 2000,
      actors: `Nenad Jezdić, Sloboda Mićalović, Ljubomir Bandović, Bojan Lazarov,
              Jovana Belović, Bogdana Obradović, Vesna Stankovič, Cvijeta Mesić, Bojan Dimitrijević,
              Nebojša Milovanović,Goran Šušljik, Maja Kolundžija Zoroe`,
      imageUrl: 'https://www.jdp.rs/wp-content/uploads/2020/10/Pucina-Latinica.jpg',
      userId: 'djdsa'
    }
  ];
  constructor(private http: HttpClient, private authService: AuthService) { }

  get performances() {
    return this._performances.asObservable();
  }

  addPerformance(name: string, date: Date, place: string, price: number, actors: string, imageUrl: string) {
    let generatedId;
    let newPerformance: Performance;

    return this.authService.userId.pipe(
      take(1),
      switchMap(userId => {
        newPerformance = new Performance(
          null,
          name,
          date,
          place,
          price,
          actors,
          imageUrl,
          userId
        );
        return this.http.post<{name: string}>(
          'https://performances-app-default-rtdb.europe-west1.firebasedatabase.app/performances.json', newPerformance);
      }),
      take(1),
      switchMap((resData) => {
        generatedId = resData.name;
        return this.performances;
      }),
      take(1),
      tap((performances) => {
        newPerformance.id = generatedId;
        this._performances.next(performances.concat(newPerformance));
      })
    );

    /*
    return this.http.post<{name: string}>('https://performances-app-default-rtdb.europe-west1.firebasedatabase.app/performances.json', {
      name, date, place, price, actors, imageUrl
    }).pipe(switchMap ((resData) => {
      generatedId = resData.name;
      return this.performances;

    }), take(1), tap((performances) => {
      this._performances.next(performances.concat({
        id: generatedId,
        name,
        date,
        place,
        price,
        actors,
        imageUrl,
      }));
    }));
    */
  }

  getPerformances() {
    /*
    return this.http
    .get<{[key: string]: PerformanceData}>(
      `https://performances-app-default-rtdb.europe-west1.firebasedatabase.app/performances.json`)
    .pipe(map((performancesData) => {
      const performances: Performance[] = [];

      for(const key in performancesData) {
        if(performancesData.hasOwnProperty(key)) {
          performances.push(new Performance(key, performancesData[key].name,
            new Date(performancesData[key].date), performancesData[key].place,
            performancesData[key].price, performancesData[key].actors,
            performancesData[key].imageUrl, performancesData[key].userId)
          );
        }
      }
      return performances;
    }),
      tap(performances => {
        this._performances.next(performances);
      })
    );
    */
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => this.http
          .get<{ [key: string]: PerformanceData }>(
            `https://performances-app-default-rtdb.europe-west1.firebasedatabase.app/performances.json?auth=${token}`
          )),
      map((performancesData) => {
        const performances: Performance[] = [];
        for (const key in performancesData) {
          if (performancesData.hasOwnProperty(key)) {
            performances.push(new Performance(key, performancesData[key].name,
                                        performancesData[key].date,
                                        performancesData[key].place,
                                        performancesData[key].price,
                                        performancesData[key].actors,
                                        performancesData[key].imageUrl,
                                        performancesData[key].userId)
            );
          }
        }
        return performances;
      }),
      tap(performances => {
        this._performances.next(performances);
      })
    );
  }

  getAllPerformances(){
    return [...this.oldPerformances];
    /*uzima sve iz niza predstava i smesta u novi niz*/
  }

  getPerformance(performanceId: string){
    return {
      ...this.oldPerformances.find(performance => performance.id === performanceId)
    };
  }


  deletePerformance(performanceId: string){
    /*this.oldPerformances = this.oldPerformances.filter(performance => {
      return performance.id !== performanceId;
    });*/
  }

}

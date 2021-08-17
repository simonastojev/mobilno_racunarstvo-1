/* eslint-disable arrow-body-style */
/* eslint-disable no-trailing-spaces */
/* eslint-disable no-underscore-dangle */
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Performance } from './performance.model';
import {map, switchMap, take, tap} from 'rxjs/operators';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';


interface PerformanceData {
  name: string;
  description: string;
  date: Date;
  place: string;
  price: number;
  actors: string;
  imageUrl: string;
  //userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class PerformancesService {
  private _performances = new BehaviorSubject<Performance[]>([]);

  /*
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
      //userId: 'kjsks'
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
      //userId: 'djdsa'
    }
  ];
  */
  constructor(private http: HttpClient, private authService: AuthService) { }

  get performances() {
    return this._performances.asObservable();
  }

  addPerformance(name: string, description: string, date: Date, place: string, price: number, actors: string, imageUrl: string) {
    let generatedId;

    return this.http.post<{name: string}>(`https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances.json`,
      { name,
        description,
        date,
        place,
        price,
        actors,
        imageUrl,
      }).pipe(switchMap((resData) => {

        generatedId = resData.name;
        return this.performances;

      }), take(1), tap(performances => {
        this._performances.next(performances.concat({
          id: generatedId,
          name,
          description,
          date,
          place,
          price,
          actors,
          imageUrl,
        }));
      })
    );

    /*
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
    */


  }

  getPerformances() {
    return this.http.
      get<{[key: string]: PerformanceData}>(`https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances.json`)
      .pipe(map((performanceData) => {
      const performances: Performance[] = [];

      for(const key in performanceData){
      if(performanceData.hasOwnProperty(key)){
        performances.push({
          id: key,
          name: performanceData[key].name,
          description: performanceData[key].description,
          date: performanceData[key].date,
          place: performanceData[key].place,
          price: performanceData[key].price,
          actors: performanceData[key].actors,
          imageUrl: performanceData[key].imageUrl,
        });
      }
    }
    this._performances.next(performances);
    return performances;
  }));
    /*
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
    */
  }


  getPerformance(id: string){
    return this.http
    .get<PerformanceData>(
    `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json`)
    .pipe(map((resData: PerformanceData) => {
      return new Performance(
        id,
        resData.name,
        resData.description,
        resData.date,
        resData.place,
        resData.price,
        resData.actors,
        resData.imageUrl
      );
    }));
  }


  deletePerformance(id: string){
    return this.http.delete(
      `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json`)
    .pipe(switchMap(() => {
      return this.performances;
    }),
    take(1),
    tap((performances) => {
      this._performances.next(performances.filter((p) => p.id !== id));
    })
    );
  }

  editPerformance(
    id: string,
    name: string,
    description: string,
    date: Date,
    place: string,
    price: number,
    actors: string,
    imageUrl: string
    )
    {
    return this.http
    .put(`https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json`,
    {
      name,
      description,
      date,
      place,
      price,
      actors,
      imageUrl,
    }
    )
    .pipe(switchMap(() => {
    return this.performances;
    }),
    take(1),
    tap((performances) => {
    const updatedPerfIndex = performances.findIndex((p) => p.id === id);
    const updatedPerformances = [...performances];
    updatedPerformances[updatedPerfIndex] = new Performance(
      id,
      name,
      description,
      date,
      place,
      price,
      actors,
      imageUrl
    );
    this._performances.next(updatedPerformances);
    })
    );
  }

}

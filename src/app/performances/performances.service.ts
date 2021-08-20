/* eslint-disable max-len */
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
    let newPerformance: Performance;

    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        newPerformance = new Performance(
          null,
          name,
          description,
          date,
          place,
          price,
          actors,
          imageUrl
        );
        return this.http.post<{name: string}>(
          `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances.json?auth=${token}`, newPerformance);
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
  }

  getPerformances() {
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.
          get<{[key: string]: PerformanceData}>(
            `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances.json?auth=${token}`
            );
          }),
          map((performanceData: any) => {
            const performances: Performance[] = [];

          for(const key in performanceData){
            if(performanceData.hasOwnProperty(key)){
              performances.push(new Performance(key, performanceData[key].name, performanceData[key].description, performanceData[key].date, performanceData[key].place, performanceData[key].price, performanceData[key].actors, performanceData[key].imageUrl)
              );
            }
          }
        return performances;
      }),
      tap(performances => {
        this._performances.next(performances);
      }));
  }


  getPerformance(id: string){
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.get<PerformanceData>(
          `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json?auth=${token}`
        );
      }),
      map((resData: PerformanceData) => {
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
    return this.authService.token.pipe(
      take(1),
      switchMap((token) => {
        return this.http.delete(
          `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json?auth=${token}`
        );
      }),
      switchMap(() => {
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
      return this.authService.token.pipe(
        take(1),
        switchMap((token) => {
          return this.http.put(
            `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/performances/${id}.json?auth=${token}`,
          {
            name,
            description,
            date,
            place,
            price,
            actors,
            imageUrl,
          }
        );
      }), switchMap(() => {
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

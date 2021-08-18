/* eslint-disable arrow-body-style */
/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../auth/user.model';
import { Users } from './users.model';


interface UserData {
  fullname: string;
  phoneNumber: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  private _users = new BehaviorSubject<Users[]>([]);

  constructor(private http: HttpClient) { }

  get users() {
    return this._users.asObservable();
  }

  getUsers() {
    return this.http.
      get<{[key: string]: UserData}>(`https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users.json`)
      .pipe(map((userData) => {
      const users: Users[] = [];

      for(const key in userData){
        if(userData.hasOwnProperty(key) && userData[key].role === 'user'){
          users.push({
            id: key,
            fullname: userData[key].fullname,
            phoneNumber: userData[key].phoneNumber,
            email: userData[key].email,
            role: userData[key].role,
          });
          console.log(userData);
      }
    }
      this._users.next(users);
      return users;
    }));
  }

  getUser(id: string){
    return this.http
    .get<UserData>(
    `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users/${id}.json`)
    .pipe(map((resData: UserData) => {
      return new Users(
        id,
        resData.fullname,
        resData.phoneNumber,
        resData.email,
        resData.role
      );
    }));
  }
}

/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, switchMap, take, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Users } from '../admin-users/users.model';
import { User } from './user.model';

interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  localId: string;
  expiresIn: string;
  registered?: boolean;
}

interface UserData {
  fullname: string;
  phoneNumber: string;
  email: string;
  password: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public currentUser = null;
  private userRole = 'user';
  private adminRole = 'admin';
  private _isUserAuthenticated = false;
  private _user = new BehaviorSubject<User>(null);
  private _users = new BehaviorSubject<Users[]>([]);

  constructor(private http: HttpClient) { }

  get users() {
    return this._users.asObservable();
  }

  get isUserAuthenticated() {

    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return !!user.token;
        } else {
          return false;
        }
      })
    );
  }

  get userId() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.id;
        } else {
          return null;
        }
      })
    );
  }

  get token() {
    return this._user.asObservable().pipe(
      map((user) => {
        if (user) {
          return user.token;
        } else {
          return null;
        }
      })
    );
  }

  register(user: UserData) {
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${environment.firebaseAPIKey}`,
      {email: user.email, password: user.password, returnSecureToken: true})
      .pipe(
        tap((userData) => {
          const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
          const newUser = new User(userData.localId, userData.email, userData.idToken, expirationTime);
          this.currentUser = newUser;
          console.log('current user: ' + this.currentUser.role);
          this._user.next(newUser);
          console.log('user' + this._user);
        })
      );
  }

  logIn(user: UserData){
    this._isUserAuthenticated = true;
    return this.http.post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.firebaseAPIKey}`,
              {email: user.email, password: user.password, returnSecureToken: true})
            .pipe(
            tap((userData) => {
              const expirationTime = new Date(new Date().getTime() + +userData.expiresIn * 1000);
              const newUser = new User(userData.localId, userData.email, userData.idToken, expirationTime);
              this.currentUser = newUser;
              console.log('current user: ' + this.currentUser.email);
              this._user.next(newUser);
            })
        );
  }

  logOut() {
    this._user.next(null);
  }

  addNewUser(user: UserData){
    if(user.email === 'admin@admin.com'){
      this.addAdmin(user).subscribe(admin =>{
        //console.log(admin);
      });
    }else{
      this.addUser(user).subscribe(res =>{
        //console.log(res);
      });
    }
  }

  addAdmin(user: UserData){

    let generatedId;
    let admin: Users;

    return this.token.pipe(
      take(1),
      switchMap((token) => {
        admin = new Users(
          null,
          user.fullname,
          user.phoneNumber,
          user.email,
          this.adminRole
        );
          return this.http.post<{name: string}>(
            `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`, admin);
          }),
          take(1),
          switchMap((resData) => {
            generatedId = resData.name;
            return this.users;
          }),
          take(1),
          tap((users) => {
            admin.id = generatedId;
            this._users.next(users.concat(admin));
          })
      );
  }

  addUser(user: UserData){

    let generatedId;
    let newUser: Users;

    return this.token.pipe(
      take(1),
      switchMap((token) => {
        newUser = new Users(
          null,
          user.fullname,
          user.phoneNumber,
          user.email,
          this.userRole
        );
          return this.http.post<{name: string}>(
            `https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users.json?auth=${token}`, newUser);
          }),
          take(1),
          switchMap((resData) => {
            generatedId = resData.name;
            return this.users;
          }),
          take(1),
          tap((users) => {
            newUser.id = generatedId;
            this._users.next(users.concat(newUser));
          })
      );
  }
}

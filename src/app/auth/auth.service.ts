/* eslint-disable no-underscore-dangle */
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
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

  constructor(private http: HttpClient) { }

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

  addUser(user: UserData){
    if(user.email === 'admin@admin.com'){
      return this.http.post<{name: string}>(
        'https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
          fullname: user.fullname, phoneNumber: user.phoneNumber,
          email: user.email, role: this.adminRole
      });
    }else{
      return this.http.post<{name: string}>(
        'https://project-7819b-default-rtdb.europe-west1.firebasedatabase.app/users.json', {
          fullname: user.fullname, phoneNumber: user.phoneNumber,
          email: user.email, role: this.userRole
      });
    }
  }
}

/* eslint-disable guard-for-in */
/* eslint-disable no-trailing-spaces */
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { IonInfiniteScroll } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Users } from './users.model';
import { UsersService } from './users.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.page.html',
  styleUrls: ['./admin-users.page.scss'],
})

export class AdminUsersPage implements OnInit, OnDestroy {

  @ViewChild(IonInfiniteScroll) infiniteScroll: IonInfiniteScroll;

  items = [];
  numTimesLeft = 5;
  users: Users[];
  private usersSub: Subscription;


  constructor(private usersService: UsersService)
  {
    //this.addMoreItems();
  }

  ngOnInit() {
    this.usersSub = this.usersService.users.subscribe(users => {
      console.log(users);
      this.users = users;
    });
  }

  ionViewWillEnter() {
    this.usersService.getUsers().subscribe(users => {
    });
  }

  ngOnDestroy() {
    if (this.usersSub) {
      this.usersSub.unsubscribe();
    }
  }

  loadData(event) {
    setTimeout(() => {
      console.log('Done');
      this.addMoreItems();
      this.numTimesLeft -= 1;
      event.target.complete();
    }, 2000);
  }

  addMoreItems(){
    /*for(let i = 0; i <13; i++){
      this.items.push(i);
    }*/
    for(let i = 0; i < 13; i++){
      for(const user in this.users){
        this.items.push(user);
      }
    }
    console.log('items:' + this.items);
  }

}

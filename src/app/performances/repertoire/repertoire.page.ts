import { Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { Performance } from '../performance.model';
import { PerformancesService } from '../performances.service';

@Component({
  selector: 'app-repertoire',
  templateUrl: './repertoire.page.html',
  styleUrls: ['./repertoire.page.scss'],
})
export class RepertoirePage implements OnInit, OnDestroy{


  performances: Performance[];
  private performancesSub: Subscription;

  constructor(private performancesService: PerformancesService) { }

  ngOnInit() {
    this.performancesSub = this.performancesService.performances.subscribe(performances => {
      this.performances = performances;
    });

  }

  ionViewWillEnter() {
    this.performancesService.getPerformances().subscribe(performances => {
    });
  }

  ngOnDestroy() {
    if (this.performancesSub) {
      this.performancesSub.unsubscribe();
    }
  }

}

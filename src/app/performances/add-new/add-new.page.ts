/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { PerformancesService } from '../performances.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {


  constructor(private performanceService: PerformancesService, private router: Router) { }

  ngOnInit() {
  }

  onAddPerformance(form: NgForm) {

    this.performanceService.addPerformance(form.value['name'], form.value['date'], form.value['place'],
    form.value['price'], form.value['actors'], form.value['imageUrl']).subscribe(res => {
      console.log(res);
    });

    this.router.navigateByUrl('/performances/tabs/repertoire');
    form.reset();
  }



}

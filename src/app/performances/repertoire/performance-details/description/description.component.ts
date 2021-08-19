/* eslint-disable @typescript-eslint/no-inferrable-types */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @angular-eslint/no-input-rename */
import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-description',
  templateUrl: './description.component.html',
  styleUrls: ['./description.component.scss'],
})
export class DescriptionComponent implements OnInit {
  @Input('expanded') expanded;
  @Input('expandHeight') expandHeight;

  currentHeight: number = 0;


  constructor() { }

  ngOnInit() {}

  ngAfterViewInit(){
    console.log(this.expanded);
    console.log(this.expandHeight);
  }

}

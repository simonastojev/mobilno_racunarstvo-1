/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/dot-notation */
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { PerformancesService } from '../performances.service';

@Component({
  selector: 'app-add-new',
  templateUrl: './add-new.page.html',
  styleUrls: ['./add-new.page.scss'],
})
export class AddNewPage implements OnInit {


  validationMessage = {
    name: [
      {type: 'required', message:'Unesite naziv predstave'},
    ],
    description: [
      {type: 'required', message:'Unesite kratak opis radnje'},
    ],
    date: [
      {type: 'required', message:'Izaberite datum'},
    ],
    place: [
      {type: 'required', message:'Unesite mesto održavanja predstave'},
    ],
    price: [
      {type: 'required', message:'Unesite cenu karte'},
    ],
    actors: [
      {type: 'required', message:'Unesite glumce koji glume u predtavi'},
    ],
    imageUrl: [
      {type: 'required', message:'Unesite URL adresu slike predstave'},
    ],
  };

  addPerformance: FormGroup;

  constructor(public formBuilder: FormBuilder,
              private authService: AuthService,
              private loadingCtl: LoadingController,
              private router: Router,
              private performancesService: PerformancesService,
              ) { }


  ngOnInit() {
    this.addPerformance = this.formBuilder.group({
      name: new FormControl('', Validators.compose([
        Validators.required
      ])),
      description: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      date: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      place: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      price: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      actors: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      imageUrl: new FormControl('', Validators.compose([
        Validators.required,
      ])),
    });
  }

  onAddPerformance() {
    this.performancesService.addPerformance(this.addPerformance.value.name, this.addPerformance.value.description,
    this.addPerformance.value.date, this.addPerformance.value.place,
    this.addPerformance.value.price, this.addPerformance.value.actors,
    this.addPerformance.value.imageUrl).subscribe(performances => {
      console.log(performances);
    });

    this.router.navigateByUrl('/performances/tabs/repertoire');
    this.addPerformance.reset();
  }

}

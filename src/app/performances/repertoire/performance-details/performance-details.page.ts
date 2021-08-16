/* eslint-disable no-trailing-spaces */
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { PerformanceModalComponent } from '../../performance-modal/performance-modal.component';
import { Performance } from '../../performance.model';
import { PerformancesService } from '../../performances.service';

@Component({
  selector: 'app-performance-details',
  templateUrl: './performance-details.page.html',
  styleUrls: ['./performance-details.page.scss'],
})
export class PerformanceDetailsPage implements OnInit {

  performance: Performance;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private performancesService: PerformancesService,
    private router: Router,
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private modalCtrl: ModalController,
    private loadingCtrl: LoadingController) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('performanceId')) {
        this.navCtrl.navigateBack('/performances/tabs/repertoire');
        return;
      }

      this.isLoading = true;

      this.performancesService
        .getPerformance(paramMap.get('performanceId'))
        .subscribe((performance) => {
          this.performance = performance;
          this.isLoading = false;
        });
    });
    console.log(this.performance);
  }

  onDeletePerformance(){
    this.alertCtrl.create({header: 'Brisanje',
        message: 'Da li ste sigurni da želite da obrišete ovu predstavu?',
        buttons: [{
          text: 'Odustani',
          role: 'cancel'
        }, {
          text: 'Obriši',
          handler: () => {
            this.performancesService.deletePerformance(this.performance.id).subscribe(() => {
              this.navCtrl.navigateBack('/performances/tabs/repertoire');
            });
          }
        }]
      }).then(alertEl => {
        alertEl.present();
      });
  }

  onEditPerformance() {
    this.modalCtrl
      .create({
        component: PerformanceModalComponent,
        componentProps: {
            name: this.performance.name,
            description: this.performance.description, date: this.performance.date,
            place: this.performance.place, price: this.performance.price,
            actors: this.performance.actors, imageUrl: this.performance.imageUrl},
      })
      .then((modal) => {
        modal.present();
        return modal.onDidDismiss();
      })
      .then((resultData) => {
        if (resultData.role === 'confirm') {
          this.loadingCtrl
            .create({message: 'Čuvanje...'})
            .then((loadingEl) => {
              loadingEl.present();
              this.performancesService
                .editPerformance(
                  this.performance.id,
                  resultData.data.performanceData.name,
                  resultData.data.performanceData.description,
                  resultData.data.performanceData.date,
                  resultData.data.performanceData.place,
                  resultData.data.performanceData.price,
                  resultData.data.performanceData.actors,
                  resultData.data.performanceData.imageUrl,
                )
                .subscribe((performances) => {
                  this.performance.name = resultData.data.performanceData.name;
                  this.performance.description = resultData.data.performanceData.description;
                  this.performance.date = resultData.data.performanceData.date;
                  this.performance.place = resultData.data.performanceData.place;
                  this.performance.price = resultData.data.performanceData.price;
                  this.performance.actors = resultData.data.performanceData.actors;
                  this.performance.imageUrl = resultData.data.performanceData.imageUrl;
                  loadingEl.dismiss();
                });
            });
        }
      });
  }

}

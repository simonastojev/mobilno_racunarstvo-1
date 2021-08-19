import { Component, Input, OnInit } from '@angular/core';
import { AlertController, NavController } from '@ionic/angular';
import { AuthService } from 'src/app/auth/auth.service';
import { Performance } from '../performance.model';
import { PerformancesService } from '../performances.service';

@Component({
  selector: 'app-performance-item',
  templateUrl: './performance-item.component.html',
  styleUrls: ['./performance-item.component.scss'],
})
export class PerformanceItemComponent implements OnInit {
  @Input() performanceItem: Performance;
  constructor(private performancesService: PerformancesService, private alertCtrl: AlertController,
              private navCtrl: NavController, public authService: AuthService) { }

  ngOnInit() {}

  onDeletePerformance(performance: Performance){
    this.alertCtrl.create({header: 'Brisanje',
        message: 'Da li ste sigurni da želite da obrišete ovu predstavu?',
        buttons: [{
          text: 'Odustani',
          role: 'cancel'
        }, {
          text: 'Obriši',
          handler: () => {
            this.performancesService.deletePerformance(performance.id).subscribe(() => {
              this.navCtrl.navigateBack('/performances/tabs/repertoire');
            });
          }
        }]
      }).then(alertEl => {
        alertEl.present();
      });
  }
}

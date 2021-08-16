import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ModalController } from '@ionic/angular';
import { PerformancesService } from '../performances.service';

@Component({
  selector: 'app-performance-modal',
  templateUrl: './performance-modal.component.html',
  styleUrls: ['./performance-modal.component.scss'],
})
export class PerformanceModalComponent implements OnInit {
  @Input() name: string;
  @Input() description: string;
  @Input() date: Date;
  @Input() place: string;
  @Input() price: number;
  @Input() actors: string;
  @Input() imageUrl: string;
  @ViewChild('editPerformance', { static: true }) editPerformance: NgForm;


  constructor(private modalCtrl: ModalController, private performancesService: PerformancesService) { }


  ngOnInit() { }

  onCancel() {
    this.modalCtrl.dismiss();
  }

  onEditPerformance() {
    if (!this.editPerformance.valid) {
      return;
    }

    this.modalCtrl.dismiss(
      {
        performanceData: {
          name: this.editPerformance.value.name,
          description: this.editPerformance.value.description,
          date: this.editPerformance.value.date,
          place: this.editPerformance.value.place,
          price: this.editPerformance.value.price,
          actors: this.editPerformance.value.actors,
          imageUrl: this.editPerformance.value.imageUrl,
        }
      },
      'confirm'
    );
  }
}

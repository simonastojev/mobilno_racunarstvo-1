import { Component, OnInit } from '@angular/core';
import { PerformancesService } from './performances.service';
import { Performance } from './performance.model';
import { AuthService } from '../auth/auth.service';


@Component({
  selector: 'app-performances',
  templateUrl: './performances.page.html',
  styleUrls: ['./performances.page.scss'],
})
export class PerformancesPage{
  constructor(public authService: AuthService) {}
}

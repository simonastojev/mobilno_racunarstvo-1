import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-log-in',
  templateUrl: './log-in.page.html',
  styleUrls: ['./log-in.page.scss'],
})
export class LogInPage implements OnInit {

  isLoading = false;

  validationUserMessage = {
    email: [
      {type: 'required', message:'Unesite Vašu email adresu'},
      {type: 'pattern', message: 'Email adresa nije ispravna. Pokušajte ponovo'}
    ],
    password: [
      {type: 'required', message:'Unesite Vašu lozinku'},
      {type: 'minlength', message: 'Lozinka mora da ima minimum 7 karaktera'}
    ]
  };

  loginForm: FormGroup;

  constructor(public formBuilder: FormBuilder,
              private authService: AuthService,
              private loadingCtl: LoadingController,
              private router: Router,
              private nav: NavController,
              private alertCtrl: AlertController) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: new FormControl('', Validators.compose([
        Validators.required,
        Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
      ])),
      password: new FormControl('', Validators.compose([
        Validators.required,
        Validators.minLength(7)
      ])),
    });
  }

  onLogin(){
    this.isLoading = true;
    if(this.loginForm.valid){
      this.authService.logIn(this.loginForm.value).subscribe(resData => {
        this.isLoading = false;
        this.router.navigateByUrl('/performances');

      },
      errRes => {
        console.log(errRes);
        this.isLoading = false;
        let message = 'Pogrešan email ili lozinka';

        const code = errRes.error.error.message;
        if (code === 'EMAIL_NOT_FOUND') {
          message = 'Email adresa je nepostojeća.';
        } else if (code === 'INVALID_PASSWORD') {
          message = 'Pogrešna lozinka.';
        }

        this.alertCtrl.create({
          header: 'Greška',
          message,
          buttons: ['OK']
        }).then((alert) => {
          alert.present();
        });

        this.loginForm.reset();
      });
    }
  }

  goToRegisterPage(){
    this.nav.navigateForward(['signup']);
  }

}

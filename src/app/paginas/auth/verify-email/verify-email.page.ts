import { Component, OnInit } from '@angular/core';
import { AutenticationService } from 'src/app/servicios/autentication.service';

@Component({
  selector: 'app-verify-email',
  templateUrl: './verify-email.page.html',
  styleUrls: ['./verify-email.page.scss'],
})
export class VerifyEmailPage implements OnInit {

  constructor(public authSrv: AutenticationService) { }

  ngOnInit() {
  }

}

import { Injectable, NgZone ,EventEmitter, Output} from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase/app';
import { Router } from '@angular/router';
import { RestApiService} from '../../network/rest-api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})

@Injectable({
  providedIn: 'root'
})
export class LoginComponent implements OnInit {

  @Output() loginSuccessEvent: EventEmitter<any> = new EventEmitter();

  constructor(
    public afAuth: AngularFireAuth,
    public ngZone: NgZone,
    private router: Router,
    private restApi: RestApiService
  ) { }

  ngOnInit(): void {
  }


  loginAnonymous(){
    this.afAuth.signInAnonymously().then((result) => {
     
      this.ngZone.run(() => {
       
        this.router.navigate(['/developers']);
        console.log('succes');
       });
 
   }, (error) => {
    console.log(error);
   });
  }
  


  loginGithub(){

    this.afAuth.signInWithPopup( new firebase.default.auth.GithubAuthProvider()).then((result) => {
      this.restApi.setAccessToken(result);
      this.loginSuccessEvent.emit(result);
      this.ngZone.run(() => {
        this.router.navigate(['/developers']);
        console.log('succes');
       });
 
   }, (error) => {
    console.log(error);
   });
  }

}

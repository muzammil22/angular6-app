import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from  'firebase';

import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //authState: FirebaseAuthState = null;
	user: User;
  constructor(public afAuth: AngularFireAuth, private afs: AngularFirestore, public router: Router) { 

  	this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  
  async  login(email:  string, password:  string) {

	try {
	    await  this.afAuth.auth.signInWithEmailAndPassword(email, password)
	    this.router.navigate(['campaigns']);
	} catch (e) {
	    alert("Error!"  +  e.message);
	}
	}

	async logout(){
    await this.afAuth.auth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['login']);
	}

	get isLoggedIn(): boolean {
    const  user  =  JSON.parse(localStorage.getItem('user'));
    return  user  !==  null;
	}

  emailSignUp(credential: EmailPasswordCredentials) {
    return this.afAuth.auth
      .createUserWithEmailAndPassword(credential.email, credential.password)
      .then(() =>{
        console.log("success");
        this.router.navigate(['customers']);
      })
      .catch(error => console.log(error))
  }

}

export class EmailPasswordCredentials {
  name: string;
  companyName: string;
  contactNumber: string;
  email: string;
  password: string;
}
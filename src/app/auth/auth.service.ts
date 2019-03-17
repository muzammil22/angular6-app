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
	    this.router.navigate(['']);
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
      .then((user) =>{
        console.log("success", user.user.uid);
        //insert addition data in users collectoin
        let data = Object.assign({}, credential);
        delete data.password
        this.afs.collection("users_temp").doc(user.user.uid).set(data);

        this.router.navigate(['']);
      })
      .catch(error => console.log(error))
  }

}

export class EmailPasswordCredentials {
  companyName: string;
  contactNumber: string;
  email: string;
  name: string;
  password: string;
}
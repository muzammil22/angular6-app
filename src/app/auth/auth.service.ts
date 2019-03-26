import { Injectable } from '@angular/core';
import { Router } from  "@angular/router";
import { auth } from  'firebase/app';
import { AngularFireAuth } from  "@angular/fire/auth";
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from  'firebase';
import { CampaignService } from '../campaign.service';
import { Observable, of } from 'rxjs';
import { switchMap, startWith, tap, filter } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  //authState: FirebaseAuthState = null;
	user: User;
  constructor(public afAuth: AngularFireAuth, private campaignService: CampaignService, private afs: AngularFirestore, public router: Router) { 

  	this.afAuth.authState.subscribe(user => {
      if (user) {
        this.user = user;
        localStorage.setItem('user', JSON.stringify(this.user));
      } else {
        localStorage.setItem('user', null);
      }
    })
  }

  
 //  async  login(email:  string, password:  string) {

 //  	try {
 //  	    await  this.afAuth.auth.signInWithEmailAndPassword(email, password)
 //  	    this.router.navigate(['']);
 //  	} catch (e) {
 //  	    alert("Error!"  +  e.message);
 //  	}
	// }

  login(email:  string, password:  string){
    return this.afAuth.auth.signInWithEmailAndPassword(email, password)
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

  }

  resetPassword(email: string) {
    return this.afAuth.auth.sendPasswordResetEmail(
      email, 
      { url: 'http://localhost:4200/' }); 
  }

  private createDefaultCampaigns(userId){
    let welcomeCampaign = Object.assign ({},{
        campaignInfo:  {
          campaignType: 'customerWelcome',
          name: 'Welcome',
          publishDate: new Date(),
          voucherExpiration: new Date(),
          voucherValue: 25
        },
        email:  {
          body:'welcome' ,
          image: "",
          signOff: 'welcome',
          title: 'welcome'
        },
        activeStatus: false,
        userId: userId 
      })

    let birthdayCampaign = Object.assign ({}, {
        campaignInfo:  {
          name: 'birthday',
          campaignType: 'birthday',
          publishDate: new Date(),
          voucherExpiration: new Date(),
          voucherValue: 25
        },
        email:  {
          body:'welcome' ,
          image: "",
          signOff: 'welcome',
          title: 'welcome'
        },
        activeStatus: false,
        userId: userId
    })
    
    this.campaignService.defaultCampaignList.add(welcomeCampaign);
    this.campaignService.defaultCampaignList.add(birthdayCampaign);
  }

}

export class EmailPasswordCredentials {
  companyName: string;
  contactNumber: string;
  email: string;
  name: string;
  password: string;
}
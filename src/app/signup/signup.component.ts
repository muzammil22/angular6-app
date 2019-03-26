import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/firestore';
import { User } from  'firebase';
import { Router } from  "@angular/router";
import { CampaignService } from '../campaign.service';


@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signUpForm: FormGroup;
  newUser: boolean = true; // to toggle login or signup form
  passReset: boolean = false;
  user: User;
  errorMessage: string;
  showErrorMessage: boolean = false;
  isValid:boolean = true;
  signupBtnClicked: boolean = false;
  showSpinner: boolean = false;

  constructor(private campaignService: CampaignService, private fb: FormBuilder, private auth: AuthService, private firestore: AngularFirestore,  public router: Router) { }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['']);
    }
  	this.buildForm();
    this.campaignService.getDefaultCampaigns();
  }

  toggleForm(): void {
     this.newUser = !this.newUser;
   }

  signup(): void {
    this.onValueChanged(this.signUpForm.value)
    if (this.isValid){
      this.showSpinner = true;
      this.signupBtnClicked = true;
      var message = this.auth.emailSignUp(this.signUpForm.value).then((user) =>{
          console.log("success", user.user.uid);
          //insert additional data in merchants collectoin
          let data = Object.assign({userId: user.user.uid}, this.signUpForm.value);
          delete data.password
          this.firestore.collection("merchants").doc(user.user.uid).set(data);
          this.createDefaultCampaigns(user.user.uid);
          this.signupBtnClicked = false;
          this.showSpinner = false;
          this.router.navigate(['']);
        })
        .catch(error => {
          this.errorMessage = error.message;
          this.showErrorMessage = true;
          setTimeout(() => this.showErrorMessage = false, 3000);
          console.log("error:", error.message);
          this.showSpinner = false;
          this.signupBtnClicked = false;
        })
    }

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
          name: 'Birthday',
          campaignType: 'birthday',
          publishDate: new Date(),
          voucherExpiration: new Date(),
          voucherValue: 25
        },
        email:  {
          body:'birthday' ,
          image: "",
          signOff: 'birthday',
          title: 'birthday'
        },
        activeStatus: false,
        userId: userId
    })
    
    this.campaignService.defaultCampaignList.add(welcomeCampaign);
    this.campaignService.defaultCampaignList.add(birthdayCampaign);
  }


   buildForm(): void {
     this.signUpForm = this.fb.group({
        'email': ['', [
      	   Validators.required,
           Validators.email
          ]
        ],
        'password': ['', [
	        Validators.pattern('^(?=.*[0-9])(?=.*[a-zA-Z])([a-zA-Z0-9]+)$'),
	        Validators.minLength(6),
	        Validators.maxLength(25)
	      	]
     		],
     		'name': ['', [
          Validators.required,
	        Validators.maxLength(25)
	      	]
     		],
     		'companyName': ['', [
         Validators.required,
	        Validators.maxLength(25)
	      	]
     		],
     		'contactNumber': ['', [
	        Validators.minLength(8),
	        Validators.maxLength(25)
	      	]
     		],
     });

     // this.signUpForm.valueChanges.subscribe(data => this.onValueChanged(data));
     // this.onValueChanged(); // reset validation messages
   }

   // Updates validation state on form changes.
   onValueChanged(data?: any) {
     this.isValid = true;
     if (!this.signUpForm) { return; }
     const form = this.signUpForm;
     for (const field in this.formErrors) {
       // clear previous error message (if any)
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && control.errors && !control.valid) {
         if (this.isValid == true)
           this.isValid = false 
         const messages = this.validationMessages[field];
         for (const key in control.errors) {
           this.formErrors[field] += messages[key] + ' ';
         }
       }
     }
   }

  formErrors = {
     'email': '',
     'password': '',
     'companyName': '',
     'name': ''
   };

   validationMessages = {
     'email': {
       'required':      'Email is required.',
       'email':         'Email must be a valid email'
     },
     'password': {
       'required':      'Password is required.',
       'pattern':       'Password must be include at one letter and one number.',
       'minlength':     'Password must be at least 4 characters long.',
       'maxlength':     'Password cannot be more than 40 characters long.',
     },
     'companyName': {
       'required':      'Company name is required'
     },
     'name': {
       'required':      'Name is required'
     }
   };

}

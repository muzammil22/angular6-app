import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {

	signUpForm: FormGroup;
  newUser: boolean = true; // to toggle login or signup form
  passReset: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService) { }

  ngOnInit() {
  	this.buildForm();
  }

  toggleForm(): void {
     this.newUser = !this.newUser;
   }

  signup(): void {
  	console.log("signup");
    this.auth.emailSignUp(this.signUpForm.value)
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
	        Validators.maxLength(25)
	      	]
     		],
     		'companyName': ['', [
	        Validators.maxLength(25)
	      	]
     		],
     		'contactNumber': ['', [
	        Validators.minLength(8),
	        Validators.maxLength(25)
	      	]
     		],
     });

     this.signUpForm.valueChanges.subscribe(data => this.onValueChanged(data));
     this.onValueChanged(); // reset validation messages
   }

   // Updates validation state on form changes.
   onValueChanged(data?: any) {
     if (!this.signUpForm) { return; }
     const form = this.signUpForm;
     for (const field in this.formErrors) {
       // clear previous error message (if any)
       this.formErrors[field] = '';
       const control = form.get(field);
       if (control && control.dirty && !control.valid) {
         const messages = this.validationMessages[field];
         for (const key in control.errors) {
           this.formErrors[field] += messages[key] + ' ';
         }
       }
     }
   }

  formErrors = {
     'email': '',
     'password': ''
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
     }
   };

}

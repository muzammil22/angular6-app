import { Component, OnInit } from '@angular/core';
import { AuthService } from "../auth/auth.service";
import { ReactiveFormsModule, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from  'firebase';
import { Router } from  "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  resetForm: FormGroup;

  constructor(private fb: FormBuilder, private auth: AuthService, private firestore: AngularFirestore, public router: Router) { }

  ngOnInit() {
    if (this.auth.isLoggedIn) {
      this.router.navigate(['']);
    }
    this.buildForm();
  }

  resetPassword() {
    this.auth.resetPassword(this.resetForm.value['email'])
    .then(() => alert('reset link sent'),
      (rejectionReason) => alert(rejectionReason))
    .catch(e=> alert('An error occured while attempting to reset your password'))
  }

  buildForm(): void {
     this.resetForm = this.fb.group({
        'email': ['', [
           Validators.required,
           Validators.email
          ]
        ]
     });

   // this.resetForm.valueChanges.subscribe(data => this.onValueChanged(data));
   // this.onValueChanged(); // reset validation messages

     // Updates validation state on form changes.
   // onValueChanged(data?: any) {
     // if (!this.signUpForm) { return; }
     // const form = this.signUpForm;
     // for (const field in this.formErrors) {
     //   // clear previous error message (if any)
     //   this.formErrors[field] = '';
     //   const control = form.get(field);
     //   if (control && control.dirty && !control.valid) {
     //     const messages = this.validationMessages[field];
     //     for (const key in control.errors) {
     //       this.formErrors[field] += messages[key] + ' ';
     //     }
     //   }
     // }
   }

  formErrors = {
     'email': ''
   };

   validationMessages = {
     'email': {
       'required':      'Email is required.',
       'email':         'Email must be a valid email'
     }
   };
}


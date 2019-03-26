import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private firestore: AngularFirestore) {}
  user: AngularFirestoreCollection<any>;
  link: Observable<any>

  form = new FormGroup({
    id: new FormControl(null),
    name: new FormControl('', Validators.required),
    companyName: new FormControl('', Validators.required),
    email: new FormControl('', Validators.email),
    contactNumber: new FormControl('', [Validators.required, Validators.minLength(8)]),
    userId: new FormControl('')
  });

  getUser() {
    return this.firestore.collection('merchants').doc(JSON.parse(localStorage.getItem('user')).uid).ref.get();
  }


  populateForm(user) {
    this.form.setValue(user);
  }

  // updateUser(customer) {
  //   this.firestore.doc('merchants/' + this.form.value.id).update(customer);
  // }

}



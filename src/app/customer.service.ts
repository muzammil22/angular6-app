import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';


@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  constructor(private firestore: AngularFirestore) {} 
  customerList: AngularFirestoreCollection<any>;

	form = new FormGroup({
		id: new FormControl(null),
		name: new FormControl('', Validators.required),
		email: new FormControl('', Validators.email),
		contactNumber: new FormControl('', [Validators.required, Validators.minLength(8)]),
		birthdate: new FormControl(''),
	});

	getCustomers() {
		this.customerList = this.firestore.collection('users');
		return this.customerList.snapshotChanges();
	}

	insertCustomer(customer) {
    delete customer.accountType; 
    this.customerList.add(customer);
  }

  populateForm(customer) {
    this.form.setValue(customer);
  }

  updateCustomer(customer) {
    this.firestore.doc('users/' + this.form.value.id).update(customer);
  }

  deleteCustomer(id: string) {
    this.customerList.doc(id).delete();
  }
}

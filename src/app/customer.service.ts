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
		//userId: new FormControl(null),
		name: new FormControl('', Validators.required),
		email: new FormControl('', Validators.email),
		contactNumber: new FormControl('', [Validators.required, Validators.minLength(8)]),
		birthDate: new FormControl('')
	});

	getCustomers() {
		this.customerList = this.firestore.collection('customers');
		return this.customerList.snapshotChanges();
	}

	insertCustomer(customer) {
    //delete customer.accountType; 
    this.customerList.add(customer);
  }

  populateForm(customer) {
    if (typeof(customer.birthDate) != "string")
      customer.birthDate = this.convertDateToString(customer.birthDate);
    this.form.setValue(customer);
  }

  convertDateToString(date){
    console.log(date)
    var day = date.getDate();
    if (day < 10)
      day = '0' + month;
    var month = date.getMonth() + 1;
    if (month < 10)
      month = '0' + month
    var year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  updateCustomer(customer) {
    this.firestore.doc('customers/' + this.form.value.id).update(customer);
  }

  deleteCustomer(id: string) {
    this.customerList.doc(id).delete();
  }
}

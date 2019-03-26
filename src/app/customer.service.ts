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
  customerListCollection: AngularFirestoreCollection<any>;

	form = new FormGroup({
    id: new FormControl(null),
		userId: new FormControl(null),
		name: new FormControl('', Validators.required),
		email: new FormControl('', [Validators.email, Validators.required]),
		contactNumber: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern("^[0-9]*$")]),
		birthDate: new FormControl('', [Validators.required, validateBirthdate])
	});



	getCustomers() {
		this.customerList = this.firestore.collection('customers');
		return this.customerList.snapshotChanges();
	}

  getCustomerListCollection(){
    this.customerListCollection = this.firestore.collection('customerList');
    return this.customerListCollection.snapshotChanges();
  }

	insertCustomer(customer) {
    //delete customer.accountType; 
    this.customerList.add(customer);
  }

  insertCustomerInList(data, merchantId) {
    console.log(data)
    this.firestore.doc('customerList/' + merchantId).update(data)
  }

  initializeCustomerListCollection(email) {
    let data = { customers: [email], merchant: { userId: JSON.parse(localStorage.getItem('user')).uid }}
    this.customerListCollection.add(data);
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
      day = '0' + day;
    var month = date.getMonth() + 1;
    if (month < 10)
      month = '0' + month
    var year = date.getFullYear();

    return `${year}-${month}-${day}`;
  }


  updateCustomer(customer) {
    this.firestore.doc('customers/' + this.form.value.id).update(customer);
  }

  deleteCustomer(data) {
    var docId = data.id
    delete data.id
    this.firestore.doc('customerList/' + docId).update(data)
  }
  

}

  function validateBirthdate(c: FormControl) {
    var currentDate = new Date();
    return new Date(Date.parse(c.value)) < currentDate ? null : {
      validateBirthdate: {
        valid: false
      }
    };
  }

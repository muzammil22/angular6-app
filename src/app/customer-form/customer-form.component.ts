import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CustomerService } from '../customer.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-customer-form',
  templateUrl: './customer-form.component.html',
  styleUrls: ['./customer-form.component.css']
})
export class CustomerFormComponent implements OnInit {

  formControls = this.customerService.form.controls;
  submitted: boolean;
  closeResult: string;
  modalReference = null;
  showDeletedMessage: boolean;
  searchText: string = "";
  myDate = new Date();
  showSpinner: boolean = true;
  showSuccessMessage: boolean;
  alreadyExist: boolean;

  @Input() customerArray;
  @Input() disableEmail;
  @Input() merchantCustomers;

  @Output() messages = new EventEmitter();

  constructor(private firestore: AngularFirestore, public activeModal: NgbActiveModal, private customerService: CustomerService) { }

  ngOnInit() {
    // debugger
    if (this.disableEmail)
      this.customerService.form.get('email').disable();
    else
      this.customerService.form.get('email').enable();
  }

  onSubmit(){
    this.submitted = true;
    let data = Object.assign({}, this.customerService.form.value);
    if (this.customerService.form.valid){
      delete data.id;
      data.birthDate =  new Date(Date.parse(data.birthDate));
      if (data.email)
        data.email = data.email.trim();
      if (this.customerService.form.value.id == null)
        if (this.customerArray.filter(item => item.email === data.email).length == 0){
          this.customerService.insertCustomer(data);
          if(this.merchantCustomers && this.merchantCustomers.length == 0){
            this.customerService.initializeCustomerListCollection(data.email)
          }
          else {
            var customerListObj = Object.assign({}, this.merchantCustomers)
            delete customerListObj.id
            customerListObj.customers.push(data.email)
            this.customerService.insertCustomerInList(customerListObj , this.merchantCustomers.id);
            this.showSuccessMessage = true;
          }
        }
        else if(!this.checkAssociationWithMerchant(data.email)){
          //add customer ref in customerList Collection
          if (!this.merchantCustomers)
            this.customerService.initializeCustomerListCollection(data.email)
          else {
            var customerListObj = Object.assign({}, this.merchantCustomers)
            delete customerListObj.id
            customerListObj.customers.push(data.email)
            this.customerService.insertCustomerInList(customerListObj , this.merchantCustomers.id);
            this.showSuccessMessage = true;
          }
        }
        else{
          this.alreadyExist = true;
          this.activeModal.dismiss();
        }
      else {
        this.showSuccessMessage = true;
        console.log("updated");
        this.firestore.doc('customers/' + this.customerService.form.value.id).update(data);
      }
      this.activeModal.dismiss();
      this.customerService.form.reset();
      this.submitted = false;
      
    }
    this.messages.emit({ showSuccessMessage: this.showSuccessMessage, alreadyExist: this.alreadyExist })

  }

  onCancel(){
    this.activeModal.dismiss();
    this.customerService.form.reset();
  }

  private checkAssociationWithMerchant(email){
    if (this.merchantCustomers && this.merchantCustomers.customers.includes(email))
      return  true

    return false
  }
  
 }


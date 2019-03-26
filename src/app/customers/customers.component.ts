import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../customer.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { MatPaginatorModule } from '@angular/material/paginator';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  closeResult: string;
  submitted: boolean;
  showSuccessMessage: boolean;
  formControls = this.customerService.form.controls;
  modalReference = null;
  customerArray = [];
  customerListCollectionArray = [];
  merchantCustomers = {};
  showDeletedMessage: boolean;
  searchText: string = "";
  myDate = new Date();
  showSpinner: boolean = true;
  alreadyExist: boolean = false;

  constructor(private snackBar: MatSnackBar, private modalService: NgbModal, private customerService: CustomerService, 
  	private firestore: AngularFirestore) {}

  ngOnInit() {
    this.customerService.getCustomerListCollection().subscribe(
      list => {
        this.customerListCollectionArray = list.filter(item =>
          item.payload.doc.data().merchant.userId == JSON.parse(localStorage.getItem('user')).uid).map( item => { 
            return {
              id: item.payload.doc.id,
              customers: item.payload.doc.data().customers,
              merchant: item.payload.doc.data().merchant
            }
          }
        )
      }
    )

    this.customerService.getCustomers().subscribe(
      list => {
        this.showSpinner = false;
        this.customerArray = list.map(item => {
            return {
              id: item.payload.doc.id,
              birthDate : new Date(item.payload.doc.data().birthDate.seconds * 1000),
              name : item.payload.doc.data().name,
              email : item.payload.doc.data().email,
              contactNumber : item.payload.doc.data().contactNumber,
              userId : item.payload.doc.data().userId
            }
          }
        )
      }
    );

  }
  

  newCustomer() {
    this.modalReference = this.modalService.open(CustomerFormComponent, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'})
    this.modalReference.componentInstance.customerArray = this.customerArray;
    this.modalReference.componentInstance.merchantCustomers = this.customerListCollectionArray[0];
    this.showSuccessMessage =  this.modalReference.componentInstance.showSuccessMessage;
    this.modalReference.componentInstance.disableEmail = false;
    this.modalReference.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        // this.showSuccessMessage = result.showSuccessMessage;
        // setTimeout(() => this.showSuccessMessage = false, 3000);
        this.openSnackBar('Submit successfully', '', 'success-snackbar');
      }
      else if (result.alreadyExist){
        // this.alreadyExist = result.alreadyExist;
        // setTimeout(() => this.alreadyExist = false, 3000);
        this.openSnackBar('Already Exists', '', 'warning-snackbar');
      }
    })
  }

  editCustomer(customer) {
    this.modalReference = this.modalService.open(CustomerFormComponent, {backdrop: 'static'});
    this.modalReference.componentInstance.customerArray = this.customerArray;
    this.modalReference.componentInstance.disableEmail = true;
    this.customerService.populateForm(customer);
    this.modalReference.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        // this.showSuccessMessage = result.showSuccessMessage;
        // setTimeout(() => this.showSuccessMessage = false, 3000);
        this.openSnackBar('Submit successfully', '', 'success-snackbar');
      }
    })
  }

  // onSubmit(){
	 //  this.submitted = true;
  //   let data = Object.assign({}, this.customerService.form.value);
  //   if (this.customerService.form.valid){
  //     delete data.id;
  //     data.userId = JSON.parse(localStorage.getItem('user')).uid;
  //     data.birthDate =  new Date(Date.parse(data.birthDate));
  //     if (this.customerArray.filter(item => item.email === data.email).length == 0)
  //     {
  //       if (this.customerService.form.value.id == null)
  //         this.customerService.insertCustomer(data);
  //       else {
  //         console.log("updated");
  //         this.firestore.doc('customers/' + this.customerService.form.value.id).update(data);
  //       }
  //       this.showSuccessMessage = true;
  //       setTimeout(() => this.showSuccessMessage = false, 3000);
  //       this.modalReference.dismiss();
  //       this.customerService.form.reset();
  //       this.submitted = false;
  //     }
  //     else{
  //       this.alreadyExist = true;
  //       setTimeout(() => this.alreadyExist = false, 3000);
  //       this.modalReference.dismiss();
  //     }
  //   }
  // }

  onDelete(email) {
    if (confirm('Are you sure to delete this record ?')) {
      let data = Object.assign({}, this.customerListCollectionArray[0])
      var customersList = data.customers
      var newCustomerList = customersList.filter(item => 
        item !== email
      )
      data.customers = newCustomerList
      this.customerService.deleteCustomer(data);
      // this.showDeletedMessage = true;
      // setTimeout(() => this.showDeletedMessage = false, 3000);
      this.openSnackBar('Deleted successfully', '', 'delete-snackbar');
    }
  }


  // private getMerchantCustomers() {
  //   var merchantCustomers = this.customerListCollectionArray.filter(item => {
  //       return item.merchant.userId === JSON.parse(localStorage.getItem('user')).uid
  //     })
  //   return merchantCustomers[0]
  // }

  onCancel(){
    this.modalReference.dismiss();
    this.customerService.form.reset();
  }

  filterCondition(customer) {
    if(customer != undefined){
      return customer.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
    }
  }

  checkCustomer(customer){
    if(this.customerListCollectionArray.length != 0)
      return this.customerListCollectionArray[0].customers.includes(customer.email);
    else
      return false

  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: [className]
    });
  }

}

import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerService } from '../customer.service';
import { AngularFirestore } from '@angular/fire/firestore';

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
  showDeletedMessage: boolean;
  searchText: string = "";

  constructor(private modalService: NgbModal, private customerService: CustomerService, 
  	private firestore: AngularFirestore) {}

  ngOnInit() {
    this.customerService.getCustomers().subscribe(
      list => {
        this.customerArray = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        });
      });
  }

  open(modalcontent) {
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title'})
    // this.modalReference.result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return  `with: ${reason}`;
    }
  }

  onSubmit(){
	  this.submitted = true;
    let data = Object.assign({ accountType: { customer: true, merchant: false } }, this.customerService.form.value);
    delete data.id;
    if (this.customerService.form.valid && this.customerService.form.value.id == null)
      this.customerService.insertCustomer(data);
    else {
      console.log("updated");
      this.firestore.doc('users/' + this.customerService.form.value.id).update(data);
       // this.customerService.updateCustomer(data);
    }
    this.showSuccessMessage = true;
    setTimeout(() => this.showSuccessMessage = false, 3000);
    this.submitted = false;
    this.modalReference.dismiss();
    this.customerService.form.reset();
    this.customerService.form.setValue({
      id: null,
      name: '',
      email: '',
      contactNumber: ''
    });
  
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.customerService.deleteCustomer(id);
      this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  }

  onEdit(customer, modalcontent) {
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title'})
    this.customerService.populateForm(customer);
  }

  filterCondition(customer) {
    if(customer != undefined){
      return customer.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
    }
  }

}

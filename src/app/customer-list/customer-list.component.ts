import { Component, OnInit } from '@angular/core';
import {NgbModal, ModalDismissReasons, NgbDate, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';

import { CustomerService } from '../customer.service';

@Component({
  selector: 'app-customer-list',
  templateUrl: './customer-list.component.html',
  styleUrls: ['./customer-list.component.css']
})
export class CustomerListComponent implements OnInit {

	modalReference = null;
	customerArray = [];
  showDeletedMessage: boolean;
  searchText: string = "";

  constructor(private modalService: NgbModal, private customerService: CustomerService) { }
  

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

  open(modalcontent, customer) {
    this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title'})
    this.customerService.populateForm(customer);
    // this.modalReference.result.then((result) => {
    //   this.closeResult = `Closed with: ${result}`;
    // }, (reason) => {
    //   this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    // });
  }

  // onDelete($key) {
  //   if (confirm('Are you sure to delete this record ?')) {
  //     this.customerService.deleteCustomer($key);
  //     this.showDeletedMessage = true;
  //     setTimeout(() => this.showDeletedMessage = false, 3000);
  //   }
  // }

  // onEdit(customer) {
  //   this.modalReference.open();
  //   this.customerService(customer);
  // }
  // filterCondition(customer) {
  //   return customer.fullName.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
  // }

}

import { Component, OnInit } from '@angular/core';
import { CustomerService } from '../customer.service';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CustomerFormComponent } from '../customer-form/customer-form.component';
import { DefaultCampaignFormComponent } from '../default-campaign-form/default-campaign-form.component';
import { CampaignService } from '../campaign.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  customerArray = [];
  campaignArray = [];
  customerListCollectionArray = [];
  showSuccessMessage: boolean;
  alreadyExist: boolean;
  
  constructor(private campaignService: CampaignService, private customerService: CustomerService, private modalService: NgbModal) { }


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



    this.campaignService.getCampaigns().subscribe(
      list => {
        this.campaignArray = list.filter(item =>
          item.payload.doc.data().userId == JSON.parse(localStorage.getItem('user')).uid).map(item => {
            return {
              id: item.payload.doc.id,
              campaignInfo: {
                name: item.payload.doc.data().campaignInfo.name,
                publishDate: new Date(item.payload.doc.data().campaignInfo.publishDate.seconds * 1000),
                voucherExpiration: new Date(item.payload.doc.data().campaignInfo.voucherExpiration.seconds * 1000),
                voucherValue: item.payload.doc.data().campaignInfo.voucherValue
              },
              email: {
                body: item.payload.doc.data().email.body,
                image: item.payload.doc.data().email.image,
                signOff: item.payload.doc.data().email.signOff,
                title: item.payload.doc.data().email.title
              },
              userId: item.payload.doc.data().userId,
              status: item.payload.doc.data().status
            }
          }
        )
      })
  }

  openCustomerForm() {
    const modalRef = this.modalService.open(CustomerFormComponent, {backdrop: 'static'});
    modalRef.componentInstance.customerArray = this.customerArray;
    modalRef.componentInstance.merchantCustomers = this.customerListCollectionArray[0];
    modalRef.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        this.showSuccessMessage = result.showSuccessMessage;
        setTimeout(() => this.showSuccessMessage = false, 3000);
      }
      else if (result.alreadyExist){
        this.alreadyExist = result.alreadyExist;
        setTimeout(() => this.alreadyExist = false, 3000);
      }
    })
  }

  openCampaignForm(){
    const modalRef = this.modalService.open(DefaultCampaignFormComponent, {backdrop: 'static'});
    modalRef.componentInstance.campaignArray = this.campaignArray;
    modalRef.componentInstance.formType = this.campaignService.form;
    modalRef.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        this.showSuccessMessage = result.showSuccessMessage;
        setTimeout(() => this.showSuccessMessage = false, 3000);
      }
      else if (result.alreadyExist){
        this.alreadyExist = result.alreadyExist;
        setTimeout(() => this.alreadyExist = false, 3000);
      }
    })
  }

}

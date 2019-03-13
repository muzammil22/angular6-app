import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../campaign.service';
import { AngularFirestore } from '@angular/fire/firestore';

@Component({
  selector: 'app-campaings',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  closeResult: string;
  submitted: boolean;
  showSuccessMessage: boolean;
  formControls = this.campaignService.form.controls;
  modalReference = null;
  campaignArray = [];
  showDeletedMessage: boolean;
  searchText: string = "";

  constructor(private modalService: NgbModal, private campaignService: CampaignService, 
  	private firestore: AngularFirestore) {}

  ngOnInit() {
    this.campaignService.getCampaigns().subscribe(
      list => {
        this.campaignArray = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        });
      });
  }

  open(modalcontent) {
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title'});
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
    //add signed in user id in data
    let data = Object.assign({status: "scheduled"}, this.campaignService.form.value);
    delete data.id;
    if (this.campaignService.form.valid && this.campaignService.form.value.id == null)
      this.campaignService.insertCampaign(data);
    else 
      this.firestore.doc('campaigns/' + this.campaignService.form.value.id).update(data);
    this.showSuccessMessage = true;
    setTimeout(() => this.showSuccessMessage = false, 3000);
    this.submitted = false;
    this.modalReference.dismiss();
    this.campaignService.form.reset();
    // this.campaignService.form.setValue({
    //   id: null,
    //   campaignInfor: {

    //   },
    //   email: '',
    //   contactNumber: ''
    // });
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.campaignService.deleteCampaign(id);
      this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  }

  Edit(campaign,modalcontent) {
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title'})
    this.campaignService.populateForm(campaign);
  }

  filterCondition(campaign) {
    if(campaign != undefined){
      return campaign.campaignInfo.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
    }
  }

}

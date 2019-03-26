import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../campaign.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';
import { DefaultCampaignFormComponent } from '../default-campaign-form/default-campaign-form.component';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-campaings',
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.css']
})
export class CampaignsComponent implements OnInit {

  closeResult: string;
  submitted: boolean;
  showSuccessMessage: boolean;
  alreadyExist: boolean = false;
  formControls = this.campaignService.form.controls.campaignInfo;
  modalReference = null;
  campaignArray = [];
  defaultCampaignArray = [];
  showDeletedMessage: boolean;
  searchText: string = "";
  imageUrl:string = "";
  fileName:string;
  currentDate = new Date();
  showSpinner: boolean = true;
  showImageUploadSpinner: boolean = false;

  //default campaign status
  welcomeCampaign: boolean = false
  birthdayCampaign: boolean = false

  //for image upload
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;


  isEditting: boolean;
  durationInSeconds = 60;


  constructor(private snackBar: MatSnackBar, private modalService: NgbModal, private campaignService: CampaignService, 
  	private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  ngOnInit() {
    this.campaignService.getCampaigns().subscribe(
      list => {
        this.showSpinner = false;
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
              // ...item.payload.doc.data()
            }
          }
        )
      }
    );

    this.campaignService.getDefaultCampaigns().subscribe(
      list => {
        this.defaultCampaignArray = list.filter(item => 
          item.payload.doc.data().userId == JSON.parse(localStorage.getItem('user')).uid).map(item => {
          {
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
              activeStatus: item.payload.doc.data().activeStatus
            }
          }
        })
      }
    )
  }

  createCampaign(){
    const modalRef = this.modalService.open(DefaultCampaignFormComponent, {backdrop: 'static'});
    modalRef.componentInstance.campaignArray = this.campaignArray;
    modalRef.componentInstance.formType = this.campaignService.form;
    modalRef.componentInstance.collectionName = "campaigns/";
    modalRef.componentInstance.isEditting = false;
    modalRef.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        // this.showSuccessMessage = result.showSuccessMessage;
        // setTimeout(() => this.showSuccessMessage = false, 3000);
        this.openSnackBar('Submit successfully', '', 'success-snackbar');
      }
    })
  }

  editDefaultCampaign(campaign) {
    const modalRef = this.modalService.open(DefaultCampaignFormComponent, {backdrop: 'static'});
    modalRef.componentInstance.campaignArray = this.defaultCampaignArray;
    modalRef.componentInstance.collectionName = "defaultCampaigns/";
    modalRef.componentInstance.isEditting = true;
    modalRef.componentInstance.imgUrl = campaign.email.image;
    modalRef.componentInstance.formType = this.campaignService.defaultCampaignForm;
    this.campaignService.populateDefaultCampaignForm(campaign)
    modalRef.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        // this.showSuccessMessage = result.showSuccessMessage;
        // setTimeout(() => this.showSuccessMessage = false, 3000);
        this.openSnackBar('Submit successfully', '', 'success-snackbar');
      }
    })
  }

  editCampaign(campaign) {
    const modalRef = this.modalService.open(DefaultCampaignFormComponent, {backdrop: 'static'});
    modalRef.componentInstance.campaignArray = this.campaignArray;
    modalRef.componentInstance.formType = this.campaignService.form;
    modalRef.componentInstance.collectionName = "campaigns/";
    modalRef.componentInstance.isEditting = true;
    modalRef.componentInstance.imgUrl = campaign.email.image;
    this.campaignService.populateForm(campaign)
    modalRef.componentInstance.messages.subscribe((result) => {
      console.log(result)
      if(result.showSuccessMessage){
        // this.showSuccessMessage = result.showSuccessMessage;
        // setTimeout(() => this.showSuccessMessage = false, 3000);
        this.openSnackBar('Submit successfully', '', 'success-snackbar');
      }
    })
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.campaignService.deleteCampaign(id);
      this.openSnackBar('Deleted successfully', '', 'delete-snackbar');
      // this.showDeletedMessage = true;
      // setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  }

  filterCondition(campaign) {
    if(campaign != undefined && campaign.campaignInfo != undefined){
      return campaign.campaignInfo.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
    }
  }

  toggleDefaultCampaign(campaign) {
    console.log("toggle changed");
    campaign.activeStatus = !campaign.activeStatus
    this.firestore.doc('defaultCampaigns/' + campaign.id).update(campaign);

  }

  openSnackBar(message: string, action: string, className: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
      panelClass: [className]
    });
  }

}
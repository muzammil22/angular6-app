import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons, NgbDate, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { CampaignService } from '../campaign.service';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

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
  defaultCampaignArray = [];
  showDeletedMessage: boolean;
  searchText: string = "";
  imageUrl:string = "";

  //default campaign status
  welcomeCampaign: boolean = false
  birthdayCampaign: boolean = false

  //for image upload
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;


  isEditting: boolean;


  constructor(private modalService: NgbModal, private campaignService: CampaignService, 
  	private firestore: AngularFirestore, private storage: AngularFireStorage) {}

  ngOnInit() {
    this.campaignService.getCampaigns().subscribe(
      list => {
        this.campaignArray = list.map(item => {
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
            // ...item.payload.doc.data()
          }
        });
      }
    )

    this.campaignService.getDefaultCampaigns().subscribe(
      list => {
        this.defaultCampaignArray = list.map(item => {
          return {
            id: item.payload.doc.id,
            ...item.payload.doc.data()
          }
        })
      }
    )
  }

  open(modalcontent) {
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'});
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
    // add signed in user id in data
    let data = Object.assign({}, this.campaignService.form.value);
    data.email.image = (<HTMLInputElement>document.getElementById("imgurl")).src;
    delete data.id;
    data.campaignInfo.voucherExpiration =  new Date(Date.parse(data.campaignInfo.voucherExpiration));
    data.campaignInfo.publishDate =  new Date(Date.parse(data.campaignInfo.publishDate));
    if (this.campaignService.form.valid)
    { 
      if (this.campaignService.form.value.id == null){
        data.status = "scheduled";
        data.userId = JSON.parse(localStorage.getItem('user')).uid;
        this.campaignService.insertCampaign(data);
      }
      else{ 
        this.firestore.doc('campaigns/' + this.campaignService.form.value.id).update(data);
      }
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 3000);
    }
    this.submitted = false;
    this.modalReference.dismiss();
    this.campaignService.form.reset();
    this.isEditting = false;
    this.downloadURL = new Observable<string>();
  }

  onDelete(id) {
    if (confirm('Are you sure to delete this record ?')) {
      this.campaignService.deleteCampaign(id);
      this.showDeletedMessage = true;
      setTimeout(() => this.showDeletedMessage = false, 3000);
    }
  }

  onCancel(){
    this.modalReference.dismiss();
    this.campaignService.form.reset();
    this.isEditting = false;
  }

  Edit(campaign,modalcontent) {
    this.isEditting = true;
    this.modalReference = this.modalService.open(modalcontent, {ariaLabelledBy: 'modal-basic-title', backdrop: 'static'})
    this.imageUrl = campaign.email.image;
    this.campaignService.populateForm(campaign);
    // document.getElementById("imgurl").src = campaign.email.image;
  }

  filterCondition(campaign) {
    if(campaign != undefined){
      return campaign.campaignInfo.name.toLowerCase().indexOf(this.searchText.toLowerCase()) != -1;
    }
  }

  toggleDefaultCampaign(campaign) {
    console.log("toggle changed");
    campaign.activeStatus = !campaign.activeStatus
    this.firestore.doc('defaultCampaigns/' + campaign.id).update(campaign);

  }

  startUpload(event: any) {
    console.log("startUpload")
    const file = event.files[0]

    if (file.type.split('/')[0] !== 'image') {
      console.error('unsupported file type')
      return;
    }
    var user_id = JSON.parse(localStorage.getItem('user')).uid
    
    const path = `${user_id}/${new Date().getTime()}_${file.name}`;
    const customMetadata = { app: 'kaaching app'};
    const fileRef = this.storage.ref(path);

    this.task = this.storage.upload(path, file, { customMetadata });
    this.percentage = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => this.downloadURL = this.storage.ref(path).getDownloadURL())
     )
    .subscribe()


    //for edit
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.storage.ref(path).getDownloadURL().subscribe( url => {
          console.log("url:",url);
          (<HTMLInputElement>document.getElementById("imgurl")).src = url;
        })
        }))
    .subscribe()

  }

  showmesome() {
    console.log("hi")
  }


}

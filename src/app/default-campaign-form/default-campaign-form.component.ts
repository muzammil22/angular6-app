import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CampaignService } from '../campaign.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage, AngularFireUploadTask } from 'angularfire2/storage';
import { Observable } from 'rxjs';
import { finalize, tap } from 'rxjs/operators';

@Component({
  selector: 'app-default-campaign-form',
  templateUrl: './default-campaign-form.component.html',
  styleUrls: ['./default-campaign-form.component.css']
})
export class DefaultCampaignFormComponent implements OnInit {

  @Input() name;
  @Input() isEditting:boolean;
  @Input() imgUrl:string;
  @Input() campaignArray;
  @Input() formType;
  @Input() collectionName;
  @Output() messages = new EventEmitter();;

  submitted: boolean;
  showSuccessMessage: boolean;
  alreadyExist: boolean;
  showImageUploadSpinner: boolean;
  fileName:string;
  formControls;
  disableSubmittBtn: boolean;

  //for image upload
  task: AngularFireUploadTask;
  percentage: Observable<number>;
  snapshot: Observable<any>;
  downloadURL: Observable<string>;



  constructor(public activeModal: NgbActiveModal, private firestore: AngularFirestore,
   private campaignService: CampaignService, private storage: AngularFireStorage) {
    console.log(this.formType)

  }

  ngOnInit() {
    this.formControls = this.formType.controls;
  }

  onSubmit(){
    this.submitted = true;
    // add signed in user id in data
    let data = Object.assign({}, this.formType.value);
    if (this.formType.valid){
      // data.email.image = (<HTMLInputElement>document.getElementById("imgurl")) ? (<HTMLInputElement>document.getElementById("imgurl")).src : "";
      if ((<HTMLInputElement>document.getElementById("imgurl"))){
        data.email.image = (<HTMLInputElement>document.getElementById("imgurl")).src === "http://localhost:4200/" ? "" : (<HTMLInputElement>document.getElementById("imgurl")).src;
      }
      else {
        data.email.image = "";
      }
      delete data.id;
      data.campaignInfo.voucherExpiration =  new Date(Date.parse(data.campaignInfo.voucherExpiration));
      data.campaignInfo.publishDate =  new Date(Date.parse(data.campaignInfo.publishDate));
      if (this.formType.value.id == null){
        if (this.campaignArray.filter(item => item.campaignInfo.name === data.campaignInfo.name).length == 0){
          data.userId = JSON.parse(localStorage.getItem('user')).uid;
          this.campaignService.insertCampaign(data);
          this.showSuccessMessage = true;
        }
        else{
          // this.alreadyExist = true;
          this.activeModal.dismiss();
        }
      }
      else{ 
        this.showSuccessMessage = true;
        this.firestore.doc(this.collectionName + this.formType.value.id).update(data);
      }
      this.submitted = false;
      this.activeModal.dismiss();
      this.formType.reset();
      this.isEditting = false;
      this.downloadURL = new Observable<string>();
      this.messages.emit({ showSuccessMessage: this.showSuccessMessage })
    }
  }

  cancelModal(){
    this.activeModal.dismiss();
    this.isEditting = false;
    this.downloadURL = new Observable<string>();
    this.formType.reset();
  }

  startUpload(event: any) {
    console.log("startUpload");
    this.showImageUploadSpinner = true;
    this.disableSubmittBtn = true;
    
    if (<HTMLInputElement>document.getElementById("imgurl")){
      (<HTMLInputElement>document.getElementById("imgurl")).src = "";
    }
    const file = event.files[0]
    this.fileName = file.name;

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

     //for edit
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.storage.ref(path).getDownloadURL().subscribe( url => {
          this.disableSubmittBtn = false;
          this.showImageUploadSpinner = false;
          (<HTMLInputElement>document.getElementById("imgurl")).src = url;
        })
      }))
    .subscribe()
  }

}

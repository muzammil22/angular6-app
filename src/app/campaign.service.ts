import { Injectable } from '@angular/core';
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database'
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class CampaignService {

  constructor(private firestore: AngularFirestore) {} 
  campaignList: AngularFirestoreCollection<any>;
  defaultCampaignList: AngularFirestoreCollection<any>;

	form = new FormGroup({
		id: new FormControl(null),
		campaignInfo: new FormGroup ({
			name: new FormControl('', Validators.required),
			publishDate: new FormControl(''),
			voucherExpiration: new FormControl(''),
			voucherValue: new FormControl('')
		}),
		email: new FormGroup ({
			body: new FormControl(''),
			image: new FormControl(''),
			signOff: new FormControl(''),
			title: new FormControl('')
		}),
		userId: new FormControl(''),
		status: new FormControl('')
	});

	getCampaigns() {
		this.campaignList = this.firestore.collection('campaigns');
		return this.campaignList.snapshotChanges();
	}

  getDefaultCampaigns() {
    this.defaultCampaignList = this.firestore.collection('defaultCampaigns');
    return this.defaultCampaignList.snapshotChanges();
  }

  insertCampaign(campaign) {
    this.campaignList.add(campaign);
  }

  populateForm(campaign) {
    if (typeof(campaign.campaignInfo.voucherExpiration) != "string")
      campaign.campaignInfo.voucherExpiration = this.convertDateToString(campaign.campaignInfo.voucherExpiration);
    if (typeof(campaign.campaignInfo.publishDate) != "string")
      campaign.campaignInfo.publishDate = this.convertDateToString(campaign.campaignInfo.publishDate);
    this.form.setValue(campaign);
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

  updateCampaign(campaign) {
    this.firestore.doc('users/' + this.form.value.id).update(campaign);
  }

  deleteCampaign(id: string) {
    this.campaignList.doc(id).delete();
  }
}

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

	form = new FormGroup({
		id: new FormControl(null),
		campaignInfo: new FormGroup ({
			name: new FormControl(''),
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

  insertCampaign(campaign) {
    this.campaignList.add(campaign);
  }

  populateForm(campaign) {
    this.form.setValue(campaign);
  }

  updateCampaign(campaign) {
    this.firestore.doc('users/' + this.form.value.id).update(campaign);
  }

  deleteCampaign(id: string) {
    this.campaignList.doc(id).delete();
  }
}

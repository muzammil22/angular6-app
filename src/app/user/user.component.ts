import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from  '../user.service';
import { AngularFirestore } from '@angular/fire/firestore';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user = {};
  temp = {};
  showSuccessMessage: boolean
  showSpinner: boolean = true

  constructor(public userService: UserService, private firestore: AngularFirestore) { }

  ngOnInit() {
   this.temp = this.userService.getUser().then((doc) => {
      this.showSpinner = false;
      this.user = doc.data();
      let data = Object.assign({ id: JSON.parse(localStorage.getItem('user')).uid}, this.user);
      this.userService.populateForm(data)
    });
  }

  onSubmit(){
    let data = Object.assign({}, this.userService.form.value);
    delete data.id
    if (this.userService.form.valid)
    { 
      this.firestore.doc('merchants/' + this.userService.form.value.id).update(data);
      this.showSuccessMessage = true;
      setTimeout(() => this.showSuccessMessage = false, 3000);
    }
  }

}

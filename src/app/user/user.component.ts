import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { UserService } from  '../user.service';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {

  user = {};
  temp = {};
  constructor(public userService: UserService) { }

  ngOnInit() {
   this.temp = this.userService.getUser().then((doc) => {
      console.log("Document data:", doc.data());
      this.user = doc.data();
      let data = Object.assign({ id: '132'}, this.user);
      console.log("Document data:", data);
      this.userService.populateForm(data)
    });
  }

}

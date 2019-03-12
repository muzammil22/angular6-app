import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Observable } from 'rxjs';
import { AuthService } from  '../auth/auth.service';


@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

	users$: Object

  constructor(private data: DataService) { }

  ngOnInit() {
  	this.data.getUsers().subscribe(
  		data => this.users$ = data
  	)
  }

}

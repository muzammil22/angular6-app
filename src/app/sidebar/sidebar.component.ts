import { Component, OnInit } from '@angular/core';
import { AuthService } from  '../auth/auth.service';

@Component({
  selector: 'app-navigation',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  constructor(public  authService:  AuthService) { }

  ngOnInit() {
  }

}

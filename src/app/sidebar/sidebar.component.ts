import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from  "@angular/router";
import { AuthService } from "../auth/auth.service";



@Component({
  selector: 'app-navigation',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {

  currentUrl: string;

  constructor(private router: Router, public authService: AuthService) {
    router.events.subscribe((_: NavigationEnd) => this.currentUrl = _.url) 
  }

  ngOnInit() {
  }

}

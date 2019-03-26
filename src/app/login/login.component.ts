import { Component, OnInit } from  '@angular/core';
import { AuthService } from  '../auth/auth.service';
import { Router } from  "@angular/router";

@Component({
selector:  'app-login',
templateUrl:  './login.component.html',
styleUrls: ['./login.component.css']
})
export  class  LoginComponent  implements  OnInit {

  errorMessage: string;
  showErrorMessage: boolean = false;
  showSpinner:boolean = false;
  loginBtnClicked:boolean = false;

  constructor(public  authService:  AuthService, public router: Router) { }
  ngOnInit() {
  	if (this.authService.isLoggedIn) {
    	this.router.navigate(['']);
    }
  }

  login(email, password){
    this.showSpinner = true;
    this.authService.login(email, password).then((user) =>{
      
      console.log("success", user.user.uid);
      this.router.navigate(['']);
      this.loginBtnClicked = true;
    })
    .catch(error => {
      this.errorMessage = error.message;
      this.showErrorMessage = true;
      this.loginBtnClicked = false;
      this.showSpinner = false;
      setTimeout(() => this.showErrorMessage = false, 3000);
      console.log("error:", error)
    })

    
  }
}
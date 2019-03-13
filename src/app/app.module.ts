import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UsersComponent } from './users/users.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore"
import { AngularFireAuthModule } from "@angular/fire/auth";
import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { CustomerService } from './customer.service'
import { CampaignService } from './campaign.service'
import { AuthGuardService } from './auth/auth-guard.service'
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VoucherComponent } from './voucher/voucher.component';
import { SignupComponent } from './signup/signup.component';

var config = {
    apiKey: "AIzaSyDGZz5JIGHUVx0TKcHjxX8BpXWrl-LVAAA",
    authDomain: "kaaachinggg-dev.firebaseapp.com",
    databaseURL: "https://kaaachinggg-dev.firebaseio.com",
    projectId: "kaaachinggg-dev",
    storageBucket: "kaaachinggg-dev.appspot.com",
    messagingSenderId: "1038353479822"
  };
  
@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    UsersComponent,
    CampaignsComponent,
    LoginComponent,
    LoginLayoutComponent,
    HomeLayoutComponent,
    CustomersComponent,
    HomeComponent,
    VoucherComponent,
    SignupComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule
  ],
  providers: [CustomerService, CampaignService, AuthGuardService],
  bootstrap: [AppComponent]
})
export class AppModule { }

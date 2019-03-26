import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SidebarComponent } from './sidebar/sidebar.component';
import { UserComponent } from './user/user.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { HttpClientModule } from '@angular/common/http'
import { AngularFireModule } from "@angular/fire";
import { AngularFirestoreModule } from "@angular/fire/firestore"
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireStorageModule } from "angularfire2/storage"
import { LoginComponent } from './login/login.component';
import { CustomersComponent } from './customers/customers.component';
import { HomeComponent } from './home/home.component';
import { CustomerService } from './customer.service'
import { CampaignService } from './campaign.service';
import { UserService } from './user.service';
import { AuthGuardService } from './auth/auth-guard.service';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { VoucherComponent } from './voucher/voucher.component';
import { SignupComponent } from './signup/signup.component';
import { MatPaginatorModule } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule, MatListModule, MatToolbarModule } from '@angular/material';
import { LoadingSpinnerComponent } from './loading-spinner/loading-spinner.component';
import { DefaultCampaignFormComponent } from './default-campaign-form/default-campaign-form.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { CustomerFormComponent } from './customer-form/customer-form.component';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import { MainNavComponent } from './main-nav/main-nav.component';


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
    UserComponent,
    CampaignsComponent,
    LoginComponent,
    CustomersComponent,
    HomeComponent,
    VoucherComponent,
    SignupComponent,
    LoadingSpinnerComponent,
    DefaultCampaignFormComponent,
    ResetPasswordComponent,
    CustomerFormComponent,
    MainNavComponent
  ],
  entryComponents: [DefaultCampaignFormComponent, CustomerFormComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AngularFireModule.initializeApp(config),
    AngularFireAuthModule,
    AngularFirestoreModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    MatPaginatorModule,
    BrowserAnimationsModule,
    MatSlideToggleModule,
    AngularFireStorageModule,
    MatSnackBarModule,
    MatSidenavModule,
    MatListModule,
    MatToolbarModule
  ],
  providers: [CustomerService, CampaignService, AuthGuardService, UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }

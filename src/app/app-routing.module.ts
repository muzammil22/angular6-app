import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UserComponent } from './user/user.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { LoginComponent } from './login/login.component'
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';
import { VoucherComponent } from './voucher/voucher.component';
import { SignupComponent } from './signup/signup.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';

const routes: Routes = [
	{
		 path: '',
		 component: HomeComponent,
		 canActivate: [AuthGuard]
	},
	{
		 path: 'campaigns',
		 component: CampaignsComponent,
		 canActivate: [AuthGuard]
	},
	{
		 path: 'customers',
		 component: CustomersComponent,
		 canActivate: [AuthGuard]
	},
	{
		 path: 'voucher',
		 component: VoucherComponent,
		 canActivate: [AuthGuard]
	},
	{
		 path: 'signup',
		 component: SignupComponent
	},
	{
		path: 'login',
		component: LoginComponent
	},
	{
		path: 'user',
		component: UserComponent,
		canActivate: [AuthGuard]
	}
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

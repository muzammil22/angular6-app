import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UsersComponent } from './users/users.component';
import { CampaignsComponent } from './campaigns/campaigns.component';
import { LoginComponent } from './login/login.component'
import { LoginLayoutComponent } from './login-layout/login-layout.component'
import { HomeLayoutComponent } from './home-layout/home-layout.component';
import { HomeComponent } from './home/home.component';
import { CustomersComponent } from './customers/customers.component';

const routes: Routes = [
	{
		 path: '',
		 component: HomeComponent
	},
	{
		 path: 'campaigns',
		 component: CampaignsComponent
	},
	{
		 path: 'customers',
		 component: CustomersComponent
	}
	{ path: '', redirectTo: 'login', data: { title: 'First Component' }, pathMatch: 'full' },
	{
    	path: 'login', component: LoginLayoutComponent, data: {title: 'First Component'},
    	children: [
      		{ path: '', component: LoginComponent }
    	]
  	},
  	{ path: 'main', component: HomeLayoutComponent,
	    children: [
	      { path: '', redirectTo: 'campaigns', pathMatch: 'full' },
	      { path: 'campaigns', component: CampaignsComponent }
	      // { path: 'second', component: SecondComponent }
	    ]
	 }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

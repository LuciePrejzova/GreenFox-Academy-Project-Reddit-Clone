import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { ChannelComponent } from './components/channel/channel.component';
import { AuthGuardService } from './services/auth-guard.service';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { ListPostsComponent } from './components/list-posts/list-posts.component';
import { AccountConfirmationComponent } from './components/account-confirmation/account-confirmation.component';

const routes: Routes = [
  { path: '', component: HomepageComponent },
  { path: 'channels/:id', component: ListPostsComponent },  // TODO: canActivate: [AuthGuardService]
  { path: "", component: HomepageComponent },
  { path: "channels", component: ChannelComponent}, //canActivate: [AuthGuardService]
  { path: "login", component: LoginComponent },
  { path: "registration", component: RegistrationComponent },
  { path: "confirmation/:activationToken", component: AccountConfirmationComponent },
  {path: 'profile', component: UserProfilePageComponent}, //, canActivate: [AuthGuardService]
  { path: "**", redirectTo: "" }  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import {MatPaginatorModule} from '@angular/material/paginator';

import { AppComponent } from './app.component';
import { HomepageComponent } from './components/homepage/homepage.component';
import { NavigationComponent } from './components/navigation/navigation.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { ChannelComponent } from './components/channel/channel.component';
import { CreateChannelComponent } from './components/create-channel/create-channel.component';
import { AuthInterceptorService } from './services/auth-interceptor.service';
import { ChannelInfoComponent } from './components/channel-info/channel-info.component';
import { ChannelItemComponent } from './components/channel-item/channel-item.component';
import { CommentItemComponent } from './components/comment-item/comment-item.component';
import { ListChannelsComponent } from './components/list-channels/list-channels.component';
import { ListPostsComponent } from './components/list-posts/list-posts.component';
import { PostsItemComponent } from './components/posts-item/posts-item.component';
import { ProfileItemComponent } from './components/profile-item/profile-item.component';
import { UserProfilePageComponent } from './components/user-profile-page/user-profile-page.component';
import { AdminComponent } from './components/admin/admin.component';
import { ListUserPostsComponent } from './components/list-user-posts/list-user-posts.component';
import { AccountConfirmationComponent } from './components/account-confirmation/account-confirmation.component';
import { TopPostComponent } from './components/top-post/top-post.component';
import { NewPostComponent } from './components/new-post/new-post.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    RegistrationComponent,
    LoginComponent,
    ChannelComponent,
    CreateChannelComponent,
    ListPostsComponent,
    PostsItemComponent,
    ListChannelsComponent,
    HomepageComponent,
    ChannelItemComponent,
    CommentItemComponent,
    UserProfilePageComponent,
    ProfileItemComponent,
    ChannelInfoComponent,
    AdminComponent,
    ListUserPostsComponent,
    AccountConfirmationComponent,
    TopPostComponent,
    NewPostComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FontAwesomeModule,
    HttpClientModule,
    NoopAnimationsModule,
    ReactiveFormsModule,
    FontAwesomeModule,
    HttpClientModule,
    SweetAlert2Module.forRoot(),
    FormsModule,
    MatPaginatorModule,
    ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

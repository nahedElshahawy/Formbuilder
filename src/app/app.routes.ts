import { Basics4Component } from './components/side group/basics4/basics.component';
import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CardComponent } from './components/card/card.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { BasicsComponent } from './components/side group/basics/basics.component';
import { ExtrasComponent } from './components/side group/extras/extras.component';
import { NewPagesComponent } from './components/side group/new-pages/new-pages.component';
import { MyPagesComponent } from './components/side group/my-pages/my-pages.component';
import { PageDataComponent } from './components/side group/page-data/page-data.component';
import { PublicPageDataComponent } from './components/side group/public-page-data/public-page-data.component';
import { CreateActivityComponent } from './components/side group/create-activity/create-activity.component';
import { AllActivitiesComponent } from './components/side group/all-activities/all-activities.component';
import { GroupsComponent } from './components/settings-group/groups/groups.component';
import { GroupUserComponent } from './components/settings-group/group-user/group-user.component';
import { ControlsComponent } from './components/settings-group/controls/controls.component';
import { GroupControlComponent } from './components/settings-group/group-control/group-control.component';
import { AppSettingsComponent } from './components/settings-group/app-settings/app-settings.component';
import { PreviewContainerComponent } from './components/preview-container/preview-container.component';
import { LoginComponent } from './components/login/login.component';
import { RouterOutlet } from '@angular/router';
import { UsersComponent } from './components/settings-group/users/users.component';
import { FooterComponent } from './components/footer/footer.component';
import { AuthGuard } from '../app/guards/auth-guard';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { NavbarComponent } from './components/navbar/navbar.component';
import { TestComponent } from './components/test/test.component';
import { OtpVerifyComponent } from './components/otp-verify/otp-verify.component';
import { QRTestComponent } from './components/qrtest/qrtest.component';
import { SimpleDragDropComponent } from './components/side group/simple-drag-drop/simple-drag-drop.component';
import { TotpLinkComponent } from './components/totp-link/totp-link.component';
import { EventSettingsComponent } from './components/settings-group/event-settings/event-settings.component';



export const routes: Routes = [
  // { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '', redirectTo: '/login', pathMatch: 'full' }, // إعادة توجيه افتراضية إلى صفحة تسجيل الدخول
  { path: 'login', component:LoginComponent },
  { path: 'users', component: UsersComponent}, // حماية صفحة المستخدمين
  { path: 'home', component: HomeComponent }, // حماية الصفحة الرئيسية
  // { path: 'activities', component: ActivitiesComponent, canActivate: [AuthGuard] },
    { path: 'activities', component: ActivitiesComponent},

  {path:'basics4',component:Basics4Component},
  {path:'navbar',component:NavbarComponent},
  { path: 'statistics', component: StatisticsComponent },
  { path: 'calendar', component: CalendarComponent },
  { path: 'settings', component: SettingsComponent },
  { path: 'card', component: CardComponent },
  { path: 'basics', component: BasicsComponent },
  { path: 'new-pages', component: NewPagesComponent },
  { path: 'my-pages', component: MyPagesComponent },
  { path: 'page-data', component: PageDataComponent },
  { path: 'public-page-data', component: PublicPageDataComponent },
  { path: 'create-activity', component: CreateActivityComponent },
  { path: 'all-activities', component: AllActivitiesComponent },
  { path: 'groups', component: GroupsComponent },
  { path: 'group-user', component: GroupUserComponent },
  { path: 'controls', component: ControlsComponent },
  { path: 'group-control', component: GroupControlComponent },
  { path: 'app-settings', component: AppSettingsComponent },
  {path:'preview',component:PreviewContainerComponent},
  {path:'test' , component:TestComponent},
  {path:'otp',component:OtpVerifyComponent},
  {path:'qrtest',component:QRTestComponent},
  {path:'simple',component:SimpleDragDropComponent},
  {path:'link',component:TotpLinkComponent},
  {path:'events',component:EventSettingsComponent},

  { path: 'footer', component:FooterComponent},
  { path: '**', component: ErrorPageComponent },  // نفس الأمر هنا للـ ErrorPage
];

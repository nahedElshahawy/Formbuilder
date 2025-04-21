import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { StatisticsComponent } from './components/statistics/statistics.component';
import { HomeComponent } from './components/home/home.component';
import { ActivitiesComponent } from './components/activities/activities.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { SettingsComponent } from './components/settings/settings.component';
import { CardComponent } from './components/card/card.component';
import { ErrorPageComponent } from './components/error-page/error-page.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { MatIcon } from '@angular/material/icon';
import { isPlatformBrowser, NgIf } from '@angular/common';
import { NavigationEnd,  Router, Event } from '@angular/router';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { BrowserModule } from '@angular/platform-browser';
import { Inject, PLATFORM_ID } from '@angular/core';
import { LocalStorageService } from './services/local-storge.service';
import { FooterComponent } from './components/footer/footer.component';
import { UserService } from './services/user.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ThemeService } from './services/theme.service';
import { TranslateService } from '@ngx-translate/core';
import { CreateActivityComponent } from './components/side group/create-activity/create-activity.component';
import { environment } from '../environments/environment';
import { NgxQRCodeModule } from 'ngx-qrcode2';
import { QRCodeModule } from 'angularx-qrcode';
import { ErrorInterceptor } from './interceptor';
import { UsersComponent } from './components/settings-group/users/users.component';
import { OtpVerifyComponent } from './components/otp-verify/otp-verify.component';
import { LoginComponent } from './components/login/login.component';
import { BasicsComponent } from './components/side group/basics/basics.component';
import { userReducer } from './services/user-reducer.service'; // المسار وفقاً لتنسيق ملفاتك
import { AuthInterceptor } from './services/token-interceptor';




// import { TokenInterceptor } from './services/token-interceptor';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [QRCodeModule,OtpVerifyComponent,BasicsComponent,FooterComponent,    HttpClientModule,


    ReactiveFormsModule, CommonModule, NgIf, RouterModule, HttpClientModule, CreateActivityComponent, UsersComponent,NavbarComponent, RouterOutlet, FooterComponent, HomeComponent, ActivitiesComponent, StatisticsComponent, CalendarComponent, SettingsComponent, CardComponent, ErrorPageComponent, FullCalendarModule, ReactiveFormsModule, FormsModule],
  providers:[
    



      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
      },

    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },

    RouterModule,LocalStorageService,UserService,],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] ,


  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})



export class AppComponent implements OnInit{


  title = 'formbuilder';

  isDarkMode: boolean = false;
  constructor(public themeService: ThemeService,public router: Router,private localStorageService:LocalStorageService,@Inject(PLATFORM_ID) private platformId: Object,private http:HttpClient)
  {

    router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.checkRoute();
      }
    });

   }

  ngOnInit(): void {
  }

  hideElements: boolean = false;
  noHeaderRoutes: string[] = ['/login', '/error','/otp']; // أضف '/error' إلى القائمة



  checkRoute() {
    this.hideElements = this.noHeaderRoutes.some((route) => this.router.url.startsWith(route));
  }



  toggleTheme(): void {
    this.themeService.toggleTheme();
  }



}





if (typeof Worker !== 'undefined') {
  // Create a new
  const worker = new Worker(new URL('./app.worker', import.meta.url));
  worker.onmessage = ({ data }) => {
    console.log(`page got message: ${data}`);
  };
  worker.postMessage('hello');
} else {
  // Web Workers are not supported in this environment.
  // You should add a fallback so that your program still executes correctly.
}

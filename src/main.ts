import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { routes } from './app/app.routes';
import { importProvidersFrom, PLATFORM_ID } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withFetch } from '@angular/common/http';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { UserService } from './app/services/user.service';
// import { TokenInterceptor } from './app/services/token-interceptor';
import { environment } from './environments/environment';
import { FormGroup } from '@angular/forms';
import { LoginComponent } from './app/components/login/login.component';
import { QrcodeComponent } from 'ngx-qrcode2';
import { QRTestComponent } from './app/components/qrtest/qrtest.component';
import { QRCodeModule } from 'angularx-qrcode';
import { OtpVerifyComponent } from './app/components/otp-verify/otp-verify.component';
import { AuthInterceptor } from './app/services/token-interceptor';
import { DOCUMENT } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';



export function initializeApp() {
  return () => {
    if (typeof window !== 'undefined') {
      // initialization code
    }
  };
}

export function tokenGetter() {
  return sessionStorage.getItem('token');
}



bootstrapApplication(AppComponent, {
  providers: [

    
      {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
      },

    // { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },

    provideRouter(routes),
    provideHttpClient(withFetch()),
    importProvidersFrom(BrowserAnimationsModule),
    HttpClientModule,
    importProvidersFrom(QRCodeModule),


    // مزودات أخرى إذا لزم الأمر
  ],
}).catch(err => console.error(err));

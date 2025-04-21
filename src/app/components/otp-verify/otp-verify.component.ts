import { UserService } from '../../services/user.service';
import { CommonEngine } from '@angular/ssr';
import { CommonModule, isPlatformServer, NgIf } from '@angular/common';
import { Component, OnInit, Inject, PLATFORM_ID, NgModule } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { DOCUMENT } from '@angular/common';


import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { eventTupleToStore } from '@fullcalendar/core/internal';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
import { platformBrowser } from '@angular/platform-browser';
import { UsersComponent } from '../settings-group/users/users.component';
import { LoginComponent } from '../login/login.component';
import{environment} from '../../../environments/environment';
import { UserDataService } from '../../services/user-data.service'; // <-- جديد
import { AuthInterceptor } from '../../services/token-interceptor';



@Component({
selector: 'app-otp-verify',
standalone: true,
// استورد الموديولات اللازمة إن كنت تستخدم Standalone Component
imports: [CommonModule, FormsModule,HttpClientModule, ReactiveFormsModule,UsersComponent,LoginComponent],
providers: [NgModule,HttpClientModule,


],
templateUrl: './otp-verify.component.html',
styleUrls: ['./otp-verify.component.scss']
})


  export class OtpVerifyComponent implements OnInit {

  // تُخزَّن فيها الأرقام الستة المدخلة
  otpDigits = {
  d1: '',
  d2: '',
  d3: '',
  d4: '',
  d5: '',
  d6: ''
  };


  // سنستخدم هذه المتغيرات للاحتفاظ ببيانات المستخدم إذا احتجناها
username?: string;
password?: string;
token?: string;

  // متغير للاحتفاظ بالتوكين (إن وجد)
  authToken: string | null = null;


  // افتراضيًا نفترض أن لديك userId (أو ما تحتاجين لإرساله للسيرفر)
// بإمكانك أخذه من Service أو من localStorage حسب ما يناسبك
userId: number = 0; // مثال

  constructor(
  @Inject(PLATFORM_ID) private platformId: Object,
  private router: Router,
  private http: HttpClient,
  private userDataService: UserDataService,
  public UserService:UserService
  ) {}

  ngOnInit(): void {



  // تحقق أننا في متصفح لا في بيئة SSR (Node.js)
  if (isPlatformBrowser(this.platformId)) {

  // هنا فقط يُسمح باستدعاء localStorage
  // أمثلة:
  localStorage.setItem('myKey', 'someValue');



  // نجلب المعلومات المحفوظة (لو أردنا استخدامها هنا)
  const userData = this.userDataService.getUserData();
  this.username = userData.username;
  this.password = userData.password;
  this.token = userData.token;
  this.userId = +localStorage.getItem('userId')! || 0;




    // جلب توكن
    const tokenFromLocal = localStorage.getItem('token');
    if (tokenFromLocal) {
      this.authToken = tokenFromLocal;
    }
  }
  }

  autoFocusNext(event: KeyboardEvent, nextInput: HTMLInputElement | null) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Only allow numbers
    if (!/^\d*$/.test(value)) {
      input.value = '';
      return;
    }

    if (value.length === 1 && nextInput) {
      nextInput.focus();
    }
  }

  handleBackspace(event: KeyboardEvent, prevInput: HTMLInputElement | null, currentInput: HTMLInputElement) {
    if (event.key === 'Backspace') {
      event.preventDefault();
      currentInput.value = '';
      if (prevInput) {
        prevInput.focus();
        prevInput.select();
      }
    }
  }


  otpCode: string = '';
  errorMessage: string = '';



  obfuscateCode(fullOTP: string): string {
    // لنفرض نريد إخفاء ما عدا آخر رقمين
    if (!fullOTP) return '';

    // لو أقل من رقمين، اعرضه كما هو
    if (fullOTP.length <= 2) {
    return fullOTP;
    }

    // اجعل أول (length - 2) أرقام نجوم، وأظهر آخر رقمين
    const visiblePart = fullOTP.slice(-2);
    const obfuscatedPart = fullOTP.slice(0, -2).replace(/\d/g, '*');
    return obfuscatedPart + visiblePart;
    }




  // تحقق من الكود المُدخل (مع استدعاء API)
  verifyCode() {
  // نجمع الأرقام الستة
  const enteredCode =
  this.otpDigits.d1 +
  this.otpDigits.d2 +
  this.otpDigits.d3 +
  this.otpDigits.d4 +
  this.otpDigits.d5 +
  this.otpDigits.d6;

  console.log('[OTP] Entered code:', enteredCode,   this.obfuscateCode(this.otpCode) );

  // if (!this.otpCode || this.otpCode.length < 6) {
  //   this.errorMessage = 'الرجاء إدخال رمز صحيح (6 أرقام)';
  //   return;
  //   }

  // تحقق هل لدينا توكن
  // if (!this.authToken) {
  //   alert('لم يتم العثور على توكن. الرجاء تسجيل الدخول أولاً.');
  //   return;
  // }

  // مثال لاستدعاء API
  const url = `${environment.OTPURL2}`;
  const body = {
    // code: enteredCode,
    
    UserName:"testy",
    Password:"P@ssw0rd",
    SecretKey:"",
    TwoFactorCode: enteredCode
    // token: this.authToken
  };
  this.http.post<any>(url, body).subscribe({
    next: (response) => {
      if (response.success) {
        // إذا الكود صحيح: انتقل للصفحة الرئيسية (تأكد من وجود المسار في الـ Router)
        this.router.navigate(['/home']);
      } else {
        alert('الكود غير صحيح أو حدث خطأ في التحقق!');
      }
    },
    error: (err) => {
      console.error('Error verifying code:', err);
      alert('حدث خطأ في التحقق من الكود.');
    }
  });
  }

  // إعادة إرسال الكود (مثال)
  requestCode() {
  if (!this.authToken) {
  alert('لم يتم العثور على توكن. الرجاء تسجيل الدخول أولاً.');
  return;
  }



  const url = `${environment.OTPURL2}`;
  const body = { token: this.authToken };

  // استدعِ الدالة الموجودة في user.service للتحقق
this.UserService.verifyTOTP(this.otpCode, this.userId).subscribe({
  next: (response:any) => {
    if (response.valid) {
      // نجح التحقق
      alert('تم التحقق من الرمز بنجاح!');
      // example: انتقل للصفحة الرئيسية
      this.router.navigate(['/home']);
    } else {
      // رمز خاطئ أو منتهي
      this.errorMessage = 'الرمز غير صحيح أو منتهي الصلاحية. حاول مجددًا.';
    }
  },
  error: (err:any) => {
    console.error('Error verifying TOTP:', err);
    this.errorMessage = 'حدث خطأ في التحقق من الرمز. الرجاء المحاولة لاحقًا.';
  }
});
}




  cleardigit(){

    this.otpDigits = {
      d1: '',
      d2: '',
      d3: '',
      d4: '',
      d5: '',
      d6: ''
      };

  }




  }

import { HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { User, UserService } from '../../../services/user.service';
import { Users } from '../../../models/users-model';
import { TOTP } from 'otpauth';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
// إذا كنت تستخدم angularx-qrcode:
import { QRCodeModule } from 'angularx-qrcode';
// إذا كنت تستخدم مكتبة qrcode النصية (نثبّت عبر npm install qrcode):
import * as QRCode from 'qrcode';
import { SettingsComponent } from '../../settings/settings.component';
import { environment } from '../../../../environments/environment';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';




@Component({
selector: 'app-users',
standalone: true,
imports: [
  SettingsComponent,
CommonModule,
FormsModule,
QRCodeModule, HttpClientModule
],
providers:[HttpClientModule],
templateUrl: './users.component.html',
styleUrls: ['./users.component.scss'],
})
export class UsersComponent implements OnInit {
 // هيكل المستخدم
user: User = {
  id: 0,
  username: '',
  email: '',
  nickname: '',
  deviceID: 123456,
  userName: '',
  password: '',
  SecretKey: '',
  TwoFactorCode: '',
  };
  
  // مصفوفة المستخدمين (للعرض في الجدول)
  users: User[] = [];
  emailError: string = '';
  emailPattern = "^[^\s@]+@[^\s@]+\.[^\s@]{2,}$";

  userName: string = '';
  password: string = '';
  twoFactorCode: string = '';
  

  qrImage: string = ''; // لتخزين رابط الـ QR Code المستلم من الـ API
  // تحكم في وضعية التحرير
  isEditing: boolean = false;
  currentEditingIndex: number | null = null;
  
  // نص الـ QR (المطلوب لعرضه بـ angularx-qrcode أو توليد Base64)
  qrCodeData: string = '';
  
  // صورة الـ QR في حال أردت إظهارها بصيغة Base64
  base64Image: string = '';
  
  // ردّ السيرفر من الـ OTP API
  otpResponse: any | null = null;
  
  constructor(
  private userService: UserService,
  private router: Router,
  private http: HttpClient
  ) {}

  currentUser: any= ''; // تأكدي من تخزين اسم المستخدم أو ID هنا
  
  ngOnInit(): void {
  // لو أردت جلب المستخدمين عند التحميل:
  // this.loadUsers();

  this.currentUser = this.userService.getCurrentUser(); // تأكدي أن هذه الدالة ترجع اسم المستخدم الصحيح
  }
  
  // للتحقق من صحة الإيميل عبر regex
  validateEmail(email: string): boolean {
  const emailRegex = new RegExp(this.emailPattern);
  return emailRegex.test(email);
  }
  
   // تحميل قائمة المستخدمين
   loadUsers(): void {
    this.userService.getUsers().subscribe({
      next: (fetchedUsers) => (this.users = fetchedUsers),
      error: (err) => {
        console.error('Error fetching users:', err);
        Swal.fire({
          icon: 'error',
          title: 'خطأ في تحميل البيانات',
          text: 'لم نستطع تحميل قائمة المستخدمين. الرجاء المحاولة لاحقًا.',
        });
      },
    });
  }

  
  // الدالة الرئيسية التي تتنفّذ عند الضغط على زر الحفظ
  onSubmit(): void {
  // تحقق من الحقول الإلزامية
  if (
  !this.user.username ||
  !this.user.email ||
  !this.user.nickname ||
  !this.user.password
  ) {
  Swal.fire('تنبيه', 'الرجاء ملء جميع الحقول قبل الحفظ.', 'warning');
  return;
  }
  

  

  // 1) إضافة المستخدم للـ MainAPI
  // this.userService.addUserToMainAPI(this.user).subscribe({
  //   next: (mainAPIResponse) => {
  //     console.log('تم إضافة المستخدم إلى الـ MainAPI:', mainAPIResponse);
  
      // 2) بعد نجاح الإضافة في الـ MainAPI، نستدعي الـ OTPAPI

      console.log('📤 البيانات المُرسلة API:', this.user);

      this.userService.addUserToOTPAPI(this.user).subscribe(
        {
        next: (otpResponse) => {
          console.log('تم إضافة المستخدم إلى الـ OTP API:', otpResponse);
          this.otpResponse = otpResponse;
  
          if (otpResponse?.secretKey) {
            this.user.SecretKey = '';
          }
          
          if (otpResponse?.qrCodeImage) {
            this.base64Image = otpResponse.qrCodeImage;
          }
  
          localStorage.setItem('addedUser', JSON.stringify(this.user));
  
          Swal.fire({
            icon: 'success',
            title: 'تم الحفظ',
            text: 'تم إضافة المستخدم بنجاح.',
            confirmButtonText: 'عرض رمز QR',
          }).then(() => {
              this.generateQRCode(this.userName, this.password, this.twoFactorCode);
          });
        },
        error: (err) => {
          console.error('Error adding user to OTP API:', err);
          Swal.fire({
            icon: 'error',
            title: 'خطأ',
            text: 'حدث خطأ أثناء إعداد المصادقة الثنائية.',
          });
        },
      }
    );
    }


    secretKey: string = '';  // متغير لحفظ الـ Secret Key
    qrCodeImage: string = ''; // متغير لحفظ صورة الـ QR
  
    generateQRCode(userName: string, password: string, twoFactorCode: string): void {
      console.log('Generating QR Code for:', userName, password, twoFactorCode);
      if (!userName || !password || !twoFactorCode) {
        console.error("⚠️ تأكد من إدخال اسم المستخدم وكلمة المرور ورمز التحقق!");
        return;
      }
    
      // **1️⃣ جلب SecretKey أولًا**
      this.http.get<{ secretKey: string }>(
        'https://ncwbackend.ncw.gov.eg/api/Auth/GetSecretKey', 
        { params: { userName } }
      ).subscribe(secretResponse => {
        const secretKey = secretResponse.secretKey;
    
        if (!secretKey) {
          console.error('❌ فشل في جلب SecretKey');
          return;
        }
    
        // **2️⃣ إرسال الطلب بعد الحصول على SecretKey**
        const requestBody = { 
          userName,
          password, 
          SecretKey: secretKey, 
          TwoFactorCode: twoFactorCode 
        };
    
        this.http.post<{ qrCodeImage: string }>(
          'https://ncwbackend.ncw.gov.eg/api/api/Auth/Register/', 
          requestBody
        ).subscribe(
          qrResponse => {
            if (qrResponse.qrCodeImage) {
              this.qrImage = qrResponse.qrCodeImage; // ✅ حفظ وعرض صورة الـ QR
            } else {
              console.error('❌ لم يتم استلام صورة QR Code');
            }
          },
          error => {
            console.error('❌ خطأ أثناء توليد QR Code:', error);
            if (error.status === 400) {
              console.error('⚠️ تحقق من إرسال جميع البيانات المطلوبة!');
            }
          }
        );
      }, error => {
        console.error("❌ خطأ أثناء جلب SecretKey:", error);
      });
    }
  
    
  
    // تعديل مستخدم
    editUser(index: number): void {
      this.user = { ...this.users[index] };
      this.isEditing = true;
      this.currentEditingIndex = index;
    }
  
    // حذف مستخدم
    deleteUser(index: number): void {
      Swal.fire({
        title: 'هل أنت متأكد؟',
        text: `سيتم حذف المستخدم "${this.users[index].username}"`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'نعم',
        cancelButtonText: 'إلغاء',
      }).then((result) => {
        if (result.isConfirmed) {
          this.users.splice(index, 1);
          Swal.fire('تم الحذف', 'تم حذف المستخدم بنجاح.', 'success');
        }
      });
    }
  
    // طلب HTTP عام
    makeRequest(endpoint: string) {
      const headers = new HttpHeaders({
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        Accept: 'application/json',
      });
  
      return this.http.get(`${environment.OTPURL}/${endpoint}`, {
        headers,
        responseType: 'json',
        observe: 'body',
      });
    }
  
    // تحديد حجم QR Code بناءً على عرض الشاشة
    getQRCodeSize(): number {
      return window.innerWidth < 768 ? 150 : 256;
    }
  }

import { Component, OnInit, ChangeDetectionStrategy, ChangeDetectorRef,EventEmitter, Output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';
// مكاتب لتوليد الـ TOTP والـQR
import { TOTP } from 'otpauth';
import * as QRCode from 'qrcode';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-totp-link',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule,FormsModule],
  templateUrl: './totp-link.component.html',
  styleUrl: './totp-link.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush

})
export class TotpLinkComponent implements OnInit {

  @Output() secretGenerated = new EventEmitter();



  constructor(private cdr: ChangeDetectorRef) {}


  ngOnInit(): void {
    // لو أردت استعادة سر محفوظ مسبقًا (Base64-encoded في localStorage مثلًا):
    const savedSecret = localStorage.getItem('otpSecret');
    if (savedSecret) {
    this.otpSecret = atob(savedSecret);
    }
    }


  
otpSecret: string = ''; // مفتاح Base32
otpUrl: string = ''; // رابط otpauth://
qrCodeImage: string = ''; // DataURL لصورة الـQR

// 1) توليد كود TOTP + إنشاء رابط otpauth + تحويله إلى QR

generateOTPQRCode(): void {
  try {
  // في حال أردت رابطًا لفتح تطبيق إنترنت على الجوال، بدلاً من TOTP
  // يمكنك استخدام:
  // const linkToOpen = 'https://mydomain.com/mobile-register';
  // ولكن هنا نعرض مثال TOTP حقيقي.
  
  
  
    // توليد سر عشوائي (Base32)
    const secretKey = this.generateBase32Secret();
  
    // إنشاء كائن TOTP
    const totp = new TOTP({
      issuer: 'MyAppCompany',
      label: 'user@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: secretKey
    });
  
    // إنشاء رابط otpauth
    // مثال على الشكل النهائي: 
    // otpauth://totp/MyAppCompany:user@example.com?secret=SECRET&issuer=MyAppCompany
    this.otpUrl = totp.toString();
  
    // تحويل الرابط إلى صورة QR
    QRCode.toDataURL(this.otpUrl, { 
      errorCorrectionLevel: 'H',
      width: this.getQRCodeSize()
    })
    .then(url => {
      this.qrCodeImage = url;
      this.otpSecret = secretKey;
  
      // حفظ السر لدى العميل (بشكل مبسط باستخدام Base64 فقط)
      localStorage.setItem('otpSecret', btoa(secretKey));
  
      this.cdr.detectChanges();
    })
    .catch(err => this.handleQRCodeError(err));
  
  } catch (error) {
    this.handleQRCodeError(error);
  }
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 2) دالة توليد مفتاح Base32 عشوائي (20 بايت = 160 بت)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  private generateBase32Secret(): string {
  const randomBytes = crypto.getRandomValues(new Uint8Array(20));
  return this.bytesToBase32(randomBytes);
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 3) تحويل البايتات إلى Base32
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  private bytesToBase32(bytes: Uint8Array): string {
  const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
  let result = '';
  let bits = 0;
  let buffer = 0;
  
  
  for (let i = 0; i < bytes.length; i++) {
    buffer = (buffer << 8) | bytes[i];
    bits += 8;
    while (bits >= 5) {
      bits -= 5;
      result += base32Chars[(buffer >> bits) & 0x1F];
    }
  }
  if (bits > 0) {
    buffer <<= (5 - bits);
    result += base32Chars[buffer & 0x1F];
  }
  return result;
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 4) حوار للتحقق من صحة الكود المدخل (6 خانات)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  verifyModal(): void {
  Swal.fire({
  title: 'تحقق من OTP',
  text: 'أدخل الكود المكوّن من 6 أرقام من تطبيق المصادقة',
  input: 'text',
  showCancelButton: true,
  confirmButtonText: 'تحقق',
  cancelButtonText: 'إلغاء'
  }).then(res => {
  if (res.isConfirmed && res.value) {
  const userToken = res.value.trim();
  const ok = this.verifyOTP(userToken);
  if (ok) {
  Swal.fire('نجاح', 'تم التحقق بنجاح!', 'success');
  } else {
  Swal.fire('فشل', 'الكود المدخل غير صحيح!', 'error');
  }
  }
  });
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 5) التحقق من صحة OTP (6 خانات) مقابل المفتاح المخزّن
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  verifyOTP(token: string): boolean {
  if (!this.otpSecret) {
  console.error('لا يوجد سر TOTP محفوظ!');
  return false;
  }
  try {
  const totp = new TOTP({
  issuer: 'MyAppCompany',
  label: 'user@example.com',
  algorithm: 'SHA1',
  digits: 6,
  period: 30,
  secret: this.otpSecret
  });
  // الدالة validate تُعيد delta أو null
  const delta = totp.validate({ token, window: 1 });
  return delta !== null;
  } catch (error) {
  console.error('خطأ عند التحقق من الـOTP:', error);
  return false;
  }
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 6) معالجة الخطأ عند توليد QR
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  private handleQRCodeError(error: any): void {
  console.error('QR Code Generation Error:', error);
  Swal.fire('خطأ', 'تعذّر توليد رمز الـQR!', 'error');
  }
  
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  // 7) دالة لتحديد حجم الـQR Code (يمكن جعلها ديناميكية)
  // ـــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــــ
  getQRCodeSize(): number {
  // إذا أردت مثلاً اختيار حجم أصغر على الشاشات الصغيرة:
  const isSmallScreen = window.innerWidth < 600;
  return isSmallScreen ? 200 : 256;
  }

  
  secretKey: string = '';



  generateOTP(): void {
    // توليد سر عشوائي بسيط (للتجريب)
    this.secretKey = 'ABCDEFGHPQRSTUVXZ'; // أو استخدم طريقة توليد عشوائية
    
    
    
    // إنشاء كائن TOTP من otpauth
    const totp = new TOTP({
      issuer: 'TestIssuer',
      label: 'user@example.com',
      algorithm: 'SHA1',
      digits: 6,
      period: 30,
      secret: this.secretKey
    });
    
    // إنشاء رابط otpauth
    const otpUrl = totp.toString();
    
    // إنشاء صورة QR من الرابط
    QRCode.toDataURL(otpUrl).then((url) => {
      this.qrCodeImage = url;
    
      // إطلاق حدث لكي يعرف BasicsComponent السر الجديد
      this.secretGenerated.emit(this.secretKey);
    });
    }


  verifyOtpPrompt(): void {
    const code = prompt('أدخل الكود المكوّن من 6 أرقام:');
    if (!code) return;
    // لو أردت التحقق يمكنك إنشاء كائن TOTP والتحقق: totp.validate({ token: code })
    alert('تم إدخال الكود: ' + code);
    }
    }

  

  




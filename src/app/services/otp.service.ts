import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
providedIn: 'root'
})
export class OtpService {
constructor(private http: HttpClient) {}

sendOtp(phoneNumber: string) {
// استدعاء Endpoint/API لإرسال رسالة نصية
// return this.http.post('https://api.example.com/send-otp', { phone: phoneNumber });
}


verifyOtp(phoneNumber: string, code: string) {
  // استدعاء Endpoint/API للتحقق من الكود
  // return this.http.post('https://api.example.com/verify-otp', { phone: phoneNumber, code });
  }
  }


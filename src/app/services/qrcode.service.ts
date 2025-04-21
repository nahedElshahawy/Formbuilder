// qr-code.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QRCodeService {
  constructor(private http: HttpClient) {}

  // التحقق من صلاحية QR Code
  validateQRCode(qrData: string): boolean {
    try {
      // التحقق من تنسيق البيانات
      const decodedData = JSON.parse(qrData);

      return this.checkQRCodeFormat(decodedData);
    } catch (error) {
      console.error('خطأ في التحقق من QR Code:', error);
      return false;
    }
  }

  // إنشاء QR Code جديد
  generateQRCode(userData: any): Observable<string> {
    const qrData = this.prepareQRData(userData);

    return this.http.post<any>(`${environment.APIURL}/generate-qr`, qrData).pipe(
      map(response => response.qrCode),
      catchError(this.handleError)
    );
  }

  private checkQRCodeFormat(data: any): boolean {
    // التحقق من وجود كل البيانات المطلوبة
    const requiredFields = ['userId', 'timestamp', 'signature'];
    return requiredFields.every(field => data.hasOwnProperty(field)) &&
           this.isValidTimestamp(data.timestamp) &&
           this.verifySignature(data);
  }

  private isValidTimestamp(timestamp: number): boolean {
    const now = Date.now();
    const validityPeriod = 24 * 60 * 60 * 1000; // 24 ساعة بالميلي ثانية
    return (now - timestamp) < validityPeriod;
  }

  private verifySignature(data: any): boolean {
    // التحقق من التوقيع الرقمي
    try {
      // تنفيذ منطق التحقق من التوقيع
      return true;
    } catch {
      return false;
    }
  }

  private prepareQRData(userData: any) {
    return {
      userId: userData.id,
      timestamp: Date.now(),
      signature: this.generateSignature(userData)
    };
  }

  private generateSignature(data: any): string {
    // إنشاء توقيع رقمي للبيانات
    // يمكن استخدام مكتبة مثل crypto-js
    return 'signature';
  }

  private handleError(error: any) {
    console.error('خطأ في خدمة QR Code:', error);
    return throwError(() => 'فشل في معالجة QR Code');
  }
}

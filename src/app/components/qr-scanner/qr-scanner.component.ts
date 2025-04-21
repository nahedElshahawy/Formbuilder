import { Component } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { BarcodeFormat } from '@zxing/browser';




@Component({
  selector: 'app-qr-scanner',
  standalone: true,
  imports: [
    BrowserModule,
    ZXingScannerModule

  ],
  template: 
  ` <div style="text-align: center;"> <h2>Scan QR Code</h2>
   <zxing-scanner
[formats]="allowedFormats"
(scanSuccess)="handleQrScanSuccess($event)"
[tryHarder]="true">
   </zxing-scanner> 
   </div>` ,

  styles: [``],
  })

  export class QrScannerComponent {

    constructor() {}


    allowedFormats: BarcodeFormat[] = [
      BarcodeFormat.QR_CODE
      ];
    
    handleQrScanSuccess(decodedValue: string) {
    console.log('Decoded QR Value: ', decodedValue);
    
    
    // إذا أردت توجيه المستخدم مباشرة للرابط فور تعرّف الـ QR
    // تحقّق أوّلاً إن كانت القيمة تتضمن رابط صفحة الفورم المطلوبة:
    if (decodedValue.includes('https://api-ocr.egcloud.gov.eg/form')) {
      // يمكنك فتح الرابط في نافذة جديدة  أو عمل توجيه باستخدام Router في Angular
      window.open(decodedValue, '_blank');  
      // أو يمكنك عمل:
      // this.router.navigate(['/form-page']);
    }
    else {
      // إذا كان الـ QR لا يحتوي على الرابط المطلوب، يمكنك معالجة الحالة هنا
      console.warn('QR does not match the expected link.');
    }
    }
    }
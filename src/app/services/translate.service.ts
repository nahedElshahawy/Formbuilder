import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})


export class TranslationService {

  constructor(
    private http: HttpClient,
    private translate: TranslationService
  ) {
    this.loadTranslations();
  }

  loadTranslations(): void {
    // تعيين اللغة الافتراضية (مثال: الإنجليزية)
    this.translate.setDefaultLang('en');

    // تحميل ملفات الترجمة للغة الإنجليزية
    this.loadLanguage('en').subscribe(translations => {
      this.translate.setTranslation('en', translations, true);
    });

    // تحميل ملفات الترجمة للغة العربية
    this.loadLanguage('ar').subscribe(translations => {
      this.translate.setTranslation('ar', translations, true);
    });
  }
  setDefaultLang(arg0: string) {
    throw new Error('Method not implemented.');
  }
  setTranslation(arg0: string, translations: any, arg2: boolean) {
    throw new Error('Method not implemented.');
  }

  // دالة لتحميل الترجمة من السيرفر أو من ملف
  loadLanguage(language: string): Observable<any> {
    return this.http.get(`/assets/translate/${language}.json`);
  }

  // دالة لتغيير اللغة
  changeLanguage(language: string): void {
    this.translate.changeLanguage(language);
    
  }
 
}

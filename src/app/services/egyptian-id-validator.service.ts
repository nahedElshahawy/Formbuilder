import { Injectable, Inject } from '@angular/core';
import { AbstractControl, ValidationErrors, AsyncValidatorFn } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { DataService } from './data.service'; // تأكد من استيراد الخدمة بشكل صحيح

interface Government {
  id: string;
  governorate_name_ar: string;
  governorate_name_en: string;
  // حقول أخرى إذا لزم الأمر
}

@Injectable({
  providedIn: 'root',
})
export class EgyptianIdValidatorService {
  private cachedGovernments: Government[] | null = null;

  constructor(private dataService: DataService) {}

  private isValidDate(day: number, month: number, year: number): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }

  egyptianNationalIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;

      // إذا كان الحقل فارغًا، اعتبره صالحًا
      if (!id) return of(null);

      // التأكد من أن الرقم القومي يتكون من 14 رقمًا ويبدأ بـ 2 أو 3
      const idPattern = /^[23][0-9]{13}$/;
      if (id.length !== 14 || !idPattern.test(id)) {
        return of({ invalidId: 'الرقم القومي يجب أن يكون مكونًا من 14 رقمًا ويبدأ بـ 2 أو 3' });
      }

      // استخراج كود القرن والسنة والشهر واليوم
      const centuryCode = parseInt(id.charAt(0), 10);
      const yearPart = parseInt(id.substring(1, 3), 10);
      const month = parseInt(id.substring(3, 5), 10);
      const day = parseInt(id.substring(5, 7), 10);

      // تحديد السنة الكاملة
      let fullYear = 1900 + yearPart;
      if (centuryCode === 2) {
        fullYear = 1900 + yearPart;
      } else if (centuryCode === 3) {
        fullYear = 2000 + yearPart;
      } else {
        return of({ invalidCentury: 'كود القرن غير صالح' });
      }

      // التحقق من صحة تاريخ الميلاد
      if (!this.isValidDate(day, month, fullYear)) {
        return of({ invalidBirthdate: 'تاريخ الميلاد غير صالح' });
      }

      if (new Date(fullYear, month - 1, day) > new Date()) {
        return of({ invalidBirthdate: 'تاريخ الميلاد لا يمكن أن يكون في المستقبل' });
      }

      // استخراج كود المحافظة
      const governorateCode = id.substring(7, 9);

      // استخراج الجنس (اختياري)
      const genderDigit = parseInt(id.charAt(12), 10);
      const gender = genderDigit % 2 === 0 ? 'أنثى' : 'ذكر';

      // التحقق من كود المحافظة
      return this.loadGovernments().pipe(
        switchMap((governments: Government[]) => {
          const governorate = governments.find(gov => gov.id === governorateCode);
          if (!governorate) {
            return of({ invalidGovernorate: 'كود المحافظة غير صالح' });
          }

          // تحقق ناجح
          return of(null);
        }),
        catchError(() => of({ invalidGovernorate: 'حدث خطأ في جلب بيانات المحافظات' }))
      );
    };
  }

  // تحميل بيانات المحافظات
  private loadGovernments(): Observable<Government[]> {
    if (this.cachedGovernments) {
      return of(this.cachedGovernments);
    }
    return this.dataService.getGovernments().pipe(
      map((governments: Government[]) => {
        this.cachedGovernments = governments;
        return governments;
      })
    );
  }
}
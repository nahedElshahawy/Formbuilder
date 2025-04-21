// form-data.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FormDataService {

  // نستخدم BehaviorSubject لتخزين الحقول ومتابعة التغييرات عليها
  private basicFieldsSubject = new BehaviorSubject<any[]>([]);
  private additionalFieldsSubject = new BehaviorSubject<any[]>([]);

  constructor() { }

  // استرجاع الحقول الأساسية
  getBasicFields() {
    return this.basicFieldsSubject.asObservable();
  }

  // استرجاع الحقول الإضافية
  getAdditionalFields() {
    return this.additionalFieldsSubject.asObservable();
  }

  // تحديث الحقول الأساسية
  updateBasicFields(fields: any[]) {
    this.basicFieldsSubject.next(fields);
  }

  // تحديث الحقول الإضافية
  updateAdditionalFields(fields: any[]) {
    this.additionalFieldsSubject.next(fields);
  }


  
}

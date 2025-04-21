import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {

  constructor() { }

  // حفظ قيمة في localStorage
  setItem(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  // استرجاع قيمة من localStorage
  getItem(key: string): any {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  }

  // حذف قيمة من localStorage
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  // مسح كل البيانات من localStorage
  clear(): void {
    localStorage.clear();
  }
}

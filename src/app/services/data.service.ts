import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private http: HttpClient) {}

  // جلب بيانات المحافظات
  getGovernments(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/governments.json');
  }

  // جلب بيانات المدن
  getCities(): Observable<any[]> {
    return this.http.get<any[]>('/assets/data/cities.json');
  }


  // // جلب بيانات المستخدمين
  // getUsers(): Observable<any[]> {
  //   return this.http.get<any[]>('/assets/data/users.json');
  // }
}


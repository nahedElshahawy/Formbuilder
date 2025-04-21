import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class User2FAService {
  private OTPURL = 'https://ncwbackend.ncw.gov.eg/api/api/Auth/Register/'; // استبدليها برابط الـ API الفعلي

  constructor(private http: HttpClient) {}

  getUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.OTPURL);
  }

  getUserById(userId: number): Observable<User> {
    return this.http.get<User>(`${this.OTPURL}/${userId}`);
  }
                    
  enableTwoFactorAuth(userId: number): Observable<{ qrCodeImage: string; secretKey: string }> {
    return this.http.post<{ qrCodeImage: string; secretKey: string }>(
      `${this.OTPURL}/${userId}/enable-2fa`, 
      {}
    );
  }

  disableTwoFactorAuth(userId: number): Observable<any> {
    return this.http.post(`${this.OTPURL}/${userId}/disable-2fa`, {});
  }

  verifyTwoFactorAuth(userId: number, otp: string): Observable<any> {
    return this.http.post(`${this.OTPURL}/${userId}/verify-2fa`, { otp });
  }
}

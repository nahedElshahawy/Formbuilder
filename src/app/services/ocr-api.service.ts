import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OcrApiService {
  private apiUrl = 'http://localhost:3000/api/ocr';

  constructor(private http: HttpClient) {}

  extractTextFromImage(imageFile: File): Observable<any> {
   const formData = new FormData();
   formData.append('image', imageFile);

   return this.http.post<any>(this.apiUrl, formData);
 }
}
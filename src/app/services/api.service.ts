// src/app/services/api.service.ts

import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private readonly apiUrl = 'https://api-ocr.egcloud.gov.eg/';

  constructor(private http: HttpClient) {}

  // POST request to submit form data
  postFormData(data: any): Observable<any> {
    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
      // Add any other required headers
    });

    return this.http.post(`${this.apiUrl}your-endpoint`, data, { headers });
  }

  // GET request example
  getData(): Observable<any> {
    return this.http.get(`${this.apiUrl}your-get-endpoint`);
  }

  // Example for file upload
  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);

    return this.http.post(`${this.apiUrl}upload`, formData);
  }
}
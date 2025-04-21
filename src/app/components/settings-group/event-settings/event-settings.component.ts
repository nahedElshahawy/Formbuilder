import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { SettingsComponent } from '../../settings/settings.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-event-settings',
  standalone: true,
  imports: [CommonModule, FormsModule,SettingsComponent],
  providers:[HttpClientModule],
  templateUrl: './event-settings.component.html',
  styleUrl: './event-settings.component.scss'
})
export class EventSettingsComponent {

  constructor(@Inject(PLATFORM_ID) private platformId: any, private http:HttpClient){}

// عنوان الصفحة
title = 'event_control';


public getItem(key: string): string | null {
  if (isPlatformBrowser(this.platformId)) {
  return localStorage.getItem(key);
  }
  return null;
  }

public setItem(key: string, value: string) {
  if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem(key, value);
  }
  }

// مثال على بيانات يمكن عرضها بالجدول
events = [
{
name: 'النشاط الأول',
startDate: new Date(2023, 0, 1),
endDate: new Date(2023, 0, 5),
active: false
},
{
name: 'النشاط الثاني',
startDate: new Date(2023, 1, 10),
endDate: new Date(2023, 1, 12),
active: true
}
];
}





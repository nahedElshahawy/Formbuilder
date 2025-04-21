import {  Input, Renderer2 } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { EventService } from './event.service';
import { createEventId } from '../../calendar/event-utils';
import { EventInput } from '@fullcalendar/core/index.js';
import { DataService } from '../../../services/data.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatSelectModule } from '@angular/material/select';
import { CalendarComponent } from '../../calendar/calendar.component';
import { MatIconModule } from '@angular/material/icon';
import { ActivityService } from '../../../services/activity.service';
import Swal from 'sweetalert2';
import { platformBrowser } from '@angular/platform-browser';

interface City {
  id: string;
  city_name_ar: string;
  city_name_en: string;
  governorate_id: string;
}

interface Government {
  id: string;
  governorate_name_ar: string;
  governorate_name_en: string;
}

interface User {
  id: number;
  name: string;
  }

@Component({
  selector: 'app-create-activity',
  standalone: true,
  imports: [
    SidebarComponent,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CommonModule,
    CalendarComponent,
    MatIconModule,
    HttpClientModule
  ],
  providers: [ActivityService, DataService,HttpClientModule],
  templateUrl:'./create-activity.component.html',
  styleUrls: ['./create-activity.component.scss']
})
export class CreateActivityComponent implements OnInit {
  activityForm!: FormGroup; // Main form group
  activityList: any[] = []; // List to store submitted activities
  
  mainActivities: string[] = ['نشاط 1', 'نشاط 2', 'نشاط 3']; // List of main activities
  governorates: Government[] = [];
  cities: City[] = [];
  governorate: string = '';
  city: string = '';

  
  
  file: File | null = null; // Add this line
  // مثال لمجموعة مستخدمين
  users: User[] = [
  { id: 1, name: 'أحمد' },
  { id: 2, name: 'سارة' },
  { id: 3, name: 'محمد' }
  ];


  selectedImage: string | ArrayBuffer | null = null; // Selected image for activity code
  selectedColor: string = '#000000'; // Default color for activity list


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
  
  constructor(
  private activityService: ActivityService,
  private http: HttpClient,
  private dataService: DataService,
  private fb: FormBuilder,
  private eventService: EventService,
  private renderer: Renderer2,
  @Inject(PLATFORM_ID) private platformId: Object // Inject PLATFORM_ID
  ) {}
  
  ngOnInit(): void {
  this.activityForm = this.fb.group({
  activityName: ['', Validators.required],
  mainActivity: ['', Validators.required],
  governorate: ['', Validators.required],
  city: ['', Validators.required],
  startDate: ['', Validators.required],
  endDate: ['', Validators.required],
  activityCodeList: [null],
  activityListColor: [this.selectedColor],
  assignAllUsers: [false],
  users: [[]] ,  
  user: [null],// حقل خاص بالمستخدم المختار

    // مصفوفة المستخدمين
    authorizedUsers: this.fb.array([])
  });
  
  // جلب بيانات المحافظات
  this.dataService.getGovernments().subscribe((data) => {
    this.governorates = data;
  });
  
  // إضافة كنترولات المستخدمين (Checkboxes) لـ FormArray
  this.addUsersCheckboxes();
  }
  
  // جلب بيانات المدن بناءً على المحافظة المختارة
  onGovernorateChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const governorateId = target.value;
  
  
  if (governorateId) {
    this.governorate = governorateId; // Store selected governorate ID
    this.dataService.getCities().subscribe((data) => {
      this.cities = data.filter((city) => city.governorate_id === governorateId);
    });
    // Reset city selection when governorate changes
    this.activityForm.patchValue({ city: '' });
    this.city = '';
  } else {
    this.governorate = '';
    this.cities = [];
    this.city = '';
  }
  }
  
  // دالة لإنشاء كنترولات المستخدمين داخل FormArray
  private addUsersCheckboxes() {
  const authorizedUsersArray = this.authorizedUsers;
  this.users.forEach(() => authorizedUsersArray.push(new FormControl(false)));
  }
  
  // Getter لقراءة FormArray 'authorizedUsers'
  get authorizedUsers(): FormArray {
  return this.activityForm.get('authorizedUsers') as FormArray;
  }
  
  // تحديث قيمة المدينة عند الاختيار
  onCityChange(event: Event): void {
  const target = event.target as HTMLSelectElement;
  const cityId = target.value;
  this.city = cityId;
  }
  
  // رفع الصورة ومعالجتها
  onImageSelect(event: any): void {
  const file = event.target.files[0];
  if (file) {
  if (file.size > 2 * 1024 * 1024) {
  Swal.fire({
  icon: 'error',
  title: 'حجم الصورة كبير',
  text: 'الصورة يجب أن تكون أصغر من 2 ميجابايت',
  confirmButtonText: 'حسنًا'
  });
  return;
  }
  
  
  
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.src = reader.result as string;
  
      img.onload = () => {
        // حساب نسبة التصغير مع الحفاظ على نسبة العرض إلى الارتفاع
        const MAX_SIZE = 60;
        let width = img.width;
        let height = img.height;
  
        if (width > height) {
          if (width > MAX_SIZE) {
            height *= MAX_SIZE / width;
            width = MAX_SIZE;
          }
        } else {
          if (height > MAX_SIZE) {
            width *= MAX_SIZE / height;
            height = MAX_SIZE;
          }
        }
  
        // إنشاء عنصر Canvas
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
  
        canvas.width = width;
        canvas.height = height;
  
        if (ctx) {
          ctx.drawImage(img, 0, 0, width, height);
          const dataUrl = canvas.toDataURL('image/png');
          this.selectedImage = dataUrl;
          this.activityForm.patchValue({ activityCodeList: this.selectedImage });
        }

      };
    };
    reader.readAsDataURL(file);
  }
  }
  
  // تغيير اللون
  onColorChange(event: Event): void {
  const input = event.target as HTMLInputElement;
  this.selectedColor = input.value;
  this.activityForm.patchValue({ activityListColor: this.selectedColor });
  }


    
   
    // مثال: تحكّم عندما يضغط المستخدم على "تسكين جميع المستخدمين"
    onAssignAllUsersChange(event: Event): void {
    const checked = (event.target as HTMLInputElement).checked;
    
    
    // إذا كان checked = true, نعيّن جميع الـ authorizedUsers بالقيمة true
    // وإلا نعيدها إلى false
    this.authorizedUsers.controls.forEach((control) => {
      control.setValue(checked);
    });
    }


    chosenUsersIds:any;
  
  // الدالة النهائية لإرسال بيانات الفورم
  onSubmit(): void {
    if (this.activityForm.valid) {
      const formValues = this.activityForm.value;
      
      
      
      // قائمة التواريخ من startDate إلى endDate
      const dateList = this.getDatesBetween(formValues.startDate, formValues.endDate);
      
      const eventsToAdd: EventInput[] = dateList.map(date => ({
        id: createEventId(),
        title: formValues.activityName,
        start: date,
        end: date, // نفس اليوم
        allDay: true,
        backgroundColor: formValues.activityListColor,
        borderColor: formValues.activityListColor,
        extendedProps: {
          // هنا نضع الصورة باسم imageUrl، ليعرضها التقويم
          imageUrl: this.selectedImage,  
          
          mainActivity: formValues.mainActivity,
          governorate: this.governorate,
          city: this.city,
          // يمكن إرسال المستخدمين المختارين، إلخ
          chosenUsersIds: this.users
            .map((user, index) => formValues.authorizedUsers[index] ? user.id : null)
            .filter((id) => id !== null)
        }
      }));
      
      // استدعاء الخدمة لإضافة الأحداث
      this.eventService.addEvents(eventsToAdd);
      
      // إعادة تعيين النموذج
      this.activityForm.reset();
      this.selectedImage = null;
      this.selectedColor = '#000000';
      this.activityForm.patchValue({ activityListColor: this.selectedColor });
      
      // رسالة تأكيد
      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ',
        text: 'تم إنشاء النشاط بنجاح.',
        confirmButtonText: 'حسنًا'
      });
      } else {
      Swal.fire({
      icon: 'warning',
      title: 'حقول ناقصة',
      text: 'يرجى إكمال جميع الحقول المطلوبة.',
      confirmButtonText: 'حسنًا'
      });
      }
      }


  
  // إنشاء قائمة التواريخ من تاريخ البدء إلى تاريخ الانتهاء
  getDatesBetween(startDate: string, endDate: string): string[] {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dateList: string[] = [];
  
  
  let currentDate = new Date(start);
  while (currentDate <= end) {
    dateList.push(currentDate.toISOString().split('T')[0]);
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return dateList;
  }
  
  // إضافة يوم واحد (إن احتجت)
  addOneDay(dateStr: string): string {
  const date = new Date(dateStr);
  date.setDate(date.getDate() + 1);
  return date.toISOString().split('T')[0];
  }
  }
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-activities',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule, NgFor, HttpClientModule],
  providers: [BrowserModule],
  templateUrl: './activities.component.html',
  styleUrl: './activities.component.scss'
})
export class ActivitiesComponent {

   // المتغيرات الحالية
   searchTerm: string = '';  // نص البحث
   filteredData: any[] = [];  // البيانات المفلترة بناءً على البحث
   noResultsFound: boolean = false;  // إذا لم يتم العثور على نتائج
 
  form: FormGroup;
  selectedForm: string | null = null;
  formSubmitted = false;
  rowsPerPage: number = 10;  // عدد الأسطر في الصفحة
  currentPage: number = 1;   // الصفحة الحالية
  totalPages: number = 1;    // عدد الصفحات
  paginatedData: any[] = []; // البيانات المعروضة في الصفحة الحالية

  activities: any = {
    "نشاط 1": {
      "user1": ["فورم 1", "فورم 2"],
      "user2": ["فورم 3", "فورم 4"]
    },
    "نشاط 2": {
      "user3": ["فورم 5", "فورم 6"],
      "user4": ["فورم 7", "فورم 8"]
    },
  };

  users: any = [];
  forms = [];

  // بيانات محفوظة تم إدخالها سابقًا
  savedData: any[] = [
    { name: 'أحمد علي', nationalId: '123456789', birthDate: '1990-02-15' },
    { name: 'مريم سعيد', nationalId: '987654321', birthDate: '1992-05-10' },
    { name: 'عادل محمود', nationalId: '112233445', birthDate: '1985-11-22' },
    { name: 'سارة مصطفى', nationalId: '223344556', birthDate: '1988-03-01' },
    { name: 'محمد أحمد', nationalId: '556677889', birthDate: '1995-08-21' },
    { name: 'خالد حسن', nationalId: '998877665', birthDate: '1980-12-25' },
    { name: 'ليلى حسين', nationalId: '112233667', birthDate: '1993-04-15' },
    { name: 'أماني محمد', nationalId: '667788990', birthDate: '1991-07-10' },
    { name: 'عادل رضا', nationalId: '554433221', birthDate: '1994-01-02' },
    { name: 'فاطمة جمال', nationalId: '776655443', birthDate: '1987-09-13' },
    { name: 'نوال جمال', nationalId: '787654320', birthDate: '2002-09-13' },

    // يمكن إضافة المزيد من البيانات هنا
  ];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      activity: [''],
      user: [''],
      form: ['']
    });
  }

  onActivityChange() {
    const activity = this.form.get('activity')?.value;
    this.users = activity ? Object.keys(this.activities[activity]) : [];
    this.form.get('user')?.reset();
    this.forms = [];
    this.form.get('form')?.reset();
    this.selectedForm = null;
    this.formSubmitted = false;
  }


 // دالة البحث
 onSearchChange() {
  if (this.searchTerm) {
    this.filteredData = this.savedData.filter(person =>
      person.name.includes(this.searchTerm) ||
      person.nationalId.includes(this.searchTerm) ||
      person.birthDate.includes(this.searchTerm)
    );

    this.noResultsFound = this.filteredData.length === 0; // تحقق من وجود نتائج
  } else {
    this.filteredData = [...this.savedData];
    this.noResultsFound = false; // إذا لم يتم إدخال نص في خانة البحث، لا يوجد خطأ
  }

  // التحديث على البيانات المعروضة بعد التصفية
  this.paginateData();
}
    // تقسيم البيانات (pagination)
    paginateData() {
      const dataToPaginate = this.filteredData.length > 0 ? this.filteredData : this.savedData;
      const startIndex = (this.currentPage - 1) * this.rowsPerPage;
      const endIndex = startIndex + this.rowsPerPage;
      this.paginatedData = dataToPaginate.slice(startIndex, endIndex);
      this.totalPages = Math.ceil(dataToPaginate.length / this.rowsPerPage);
    }
  
  

  onUserChange() {
    const activity = this.form.get('activity')?.value;
    const user = this.form.get('user')?.value;
    this.forms = activity && user ? this.activities[activity][user] : [];
    this.form.get('form')?.reset();
    this.selectedForm = null;
    this.formSubmitted = false;
  }

  onFormChange() {
    this.selectedForm = this.form.get('form')?.value;
    this.formSubmitted = false;
  }

  onSubmit() {
    this.formSubmitted = true;
    this.paginateData();
  }

  get currentPageIndex(): number {
    return (this.currentPage - 1) * this.rowsPerPage;
  }

  // // تقسيم البيانات (pagination)
  // paginateData() {
  //   const startIndex = (this.currentPage - 1) * this.rowsPerPage;
  //   const endIndex = startIndex + this.rowsPerPage;
  //   this.paginatedData = this.savedData.slice(startIndex, endIndex);
  //   this.totalPages = Math.ceil(this.savedData.length / this.rowsPerPage);
  // }

  // تغيير الصفحة عند الضغط على زر التالي
  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.paginateData();
    }
  }

  // تغيير الصفحة عند الضغط على زر السابق
  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.paginateData();
    }
  }

  // تغيير عدد الأسطر المعروضة
  onPageChange() {
    this.currentPage = 1; // العودة إلى الصفحة الأولى عند تغيير عدد الأسطر
    this.paginateData();
  }
}
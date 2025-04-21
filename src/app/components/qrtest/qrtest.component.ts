import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { SettingsComponent } from '../settings/settings.component';
import { Router } from '@angular/router'; // Import Router
import { QRCodeModule } from 'angularx-qrcode'; // Import QRCodeModule
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-qr-test',
  standalone: true,
  imports: [SettingsComponent, FormsModule, ReactiveFormsModule, CommonModule, QRCodeModule, HttpClientModule],
  providers: [],
  templateUrl: './qrtest.component.html',
  styleUrls: ['./qrtest.component.scss'],
})
export class QRTestComponent implements OnInit {
  user: any = { // تعريف خاصية user
    id: 0,
    username: '',
    email: '',
    nickname: '',
    password: '',
    DeviceID: 123456,
  };
  users: any[] = []; // استخدام any بدلاً من User
  isEditing: boolean = false;
  currentEditingIndex: number | null = null;
  // emailPattern = "^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$"; // نمط البريد الإلكتروني
  qrCodeData: string = ''; // Data for QR code

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.http.get<any[]>('https://ncwbackend.ncw.gov.eg/api/users').subscribe({
      next: (fetchedUsers) => {
        this.users = fetchedUsers;
      },
      error: (err) => {
        console.error('Error fetching users:', err);
        Swal.fire({
          icon: 'error',
          title: 'خطأ في تحميل البيانات',
          text: 'لم نستطع تحميل قائمة المستخدمين. الرجاء المحاولة لاحقًا.',
        });
      },
    });
  }

  onSubmit(): void {
    if (!this.user.username || !this.user.email || !this.user.nickname || !this.user.password) {
      Swal.fire({
        icon: 'warning',
        title: 'حقول ناقصة',
        text: 'الرجاء ملء جميع الحقول قبل الحفظ.',
      });
      return;
    }

    // Check for existing user
    const existingUser = this.users.find(
      (u) => u.username.toLowerCase() === this.user.username.toLowerCase()
    );
    if (existingUser && (!this.isEditing || existingUser.id !== this.user.id)) {
      Swal.fire({
        icon: 'error',
        title: 'اسم المستخدم غير متاح',
        text: `اسم المستخدم ${this.user.username} مستخدم بالفعل. الرجاء اختيار اسم مستخدم آخر.`,
      });
      return;
    }

    if (this.isEditing && this.currentEditingIndex !== null) {
      // Update user
      this.http.put<any>(`https://ncwbackend.ncw.gov.eg/api/users/${this.user.id}`, this.user).subscribe({
        next: (updatedUser) => {
          Swal.fire({
            icon: 'success',
            title: 'تم التحديث',
            text: `تم تحديث المستخدم ${updatedUser.username} بنجاح.`,
          });
          // Ensure currentEditingIndex is not null before using it
          if (this.currentEditingIndex !== null) {
            this.users[this.currentEditingIndex] = updatedUser; // Update the user in the array
          }
          this.resetForm();
        },
        error: (err) => {
          console.error('Error updating user:', err);
          Swal.fire({
            icon: 'error',
            title: 'خطأ في التحديث',
            text: 'حدث خطأ أثناء تحديث المستخدم. الرجاء المحاولة لاحقًا.',
          });
        },
      });
    } else {
      // Add new user
      this.http.post<any>('https://ncwbackend.ncw.gov.eg/api/users', this.user).subscribe({
        next: (createdUser) => {
          Swal.fire({
            icon: 'success',
            title: 'تم الحفظ',
            text: `تم حفظ المستخدم ${createdUser.username} بنجاح.`,
          });
          this.users.push(createdUser); // Add the new user to the array

          // Generate QR code data
          this.qrCodeData = `${environment.OTPURL}?username=${createdUser.username}`;

          // Show QR code
          Swal.fire({
            title: 'Scan QR Code',
            html: `<qrcode [qrdata]="qrCodeData" [size]="256" [level]="'M'"></qrcode>`,
            showCancelButton: false,
            showConfirmButton: true,
            confirmButtonText: 'تم',
          }).then(() => {
            this.resetForm(); // Reset the form after showing the QR code
          });
        },
        error: (err) => {
          console.error('Error adding user:', err);
          Swal.fire({
            icon: 'error',
            title: 'خطأ في الحفظ',
            text: 'حدث خطأ أثناء إضافة المستخدم. الرجاء المحاولة لاحقًا.',
          });
        },
      });
    }
  }

  editUser(index: number): void {
    const userToEdit = this.users[index];
    this.user = { ...userToEdit }; // تحديث خاصية user بالقيم الحالية
    this.isEditing = true;
    this.currentEditingIndex = index;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteUser(index: number): void {
    const userToDelete = this.users[index];
    Swal.fire({
      title: `هل أنت متأكد من حذف المستخدم "${userToDelete.username}"؟`,
      text: 'لن تتمكن من استعادة هذه البيانات!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء',
    }).then((result) => {
      if (result.isConfirmed) {
        this.http.delete(`https://ncwbackend.ncw.gov.eg/api/users/${userToDelete.id}`).subscribe({
          next: () => {
            this.users.splice(index, 1); // Remove the user from the array
            Swal.fire({
              icon: 'success',
              title: 'تم الحذف',
              text: 'تم حذف المستخدم بنجاح.',
            });
          },
          error: (err) => {
            console.error('Error deleting user:', err);
            Swal.fire({
              icon: 'error',
              title: 'خطأ في الحذف',
              text: 'حدث خطأ أثناء حذف المستخدم. الرجاء المحاولة لاحقًا.',
            });
          },
        });
      }
    });
  }

  private resetForm(): void {
    this.user = {
      id: 0,
      username: '',
      email: '',
      nickname: '',
      password: '',
      DeviceID: 123456,
    };
    this.isEditing = false;
    this.currentEditingIndex = null;
  }
}

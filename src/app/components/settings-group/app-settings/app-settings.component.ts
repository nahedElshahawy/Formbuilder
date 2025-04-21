import { Component } from '@angular/core';
import { SettingsComponent } from '../../settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import Swal from 'sweetalert2';

interface SystemData {
  systemName: string;
  image: string;
  listColor: string;
  textColor: string;
}

@Component({
  selector: 'app-app-settings',
  standalone: true,
  imports: [SettingsComponent, FormsModule, ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './app-settings.component.html',
  styleUrls: ['./app-settings.component.scss']
})
export class AppSettingsComponent {
  systemName: string = '';
  listColor: string = '#ffffff'; // اللون الافتراضي للقائمة
  textColor: string = '#000000'; // اللون الافتراضي للنص
  imageUrl: string | ArrayBuffer | null = null;
  systemData: SystemData[] = [];

  isEditing: boolean = false;
  currentEditingIndex: number | null = null;

  onImageChange(event: any): void {
    const file = event.target.files[0];
    const allowedTypes = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];
    const maxSizeInBytes = 1 * 1024 * 1024; // 1 ميجابايت

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'نوع ملف غير مدعوم',
          text: 'الرجاء تحميل ملفات صور بامتدادات (gif, png, jpg, jpeg) فقط.',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = ''; // إعادة تعيين المدخل
        this.imageUrl = null;
        return;
      }

      if (file.size > maxSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'حجم الملف كبير جدًا',
          text: 'حجم الملف أكبر من 1 ميجابايت. الرجاء تحميل ملف أصغر.',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = ''; // إعادة تعيين المدخل
        this.imageUrl = null;
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  onSubmit(): void {
    if (!this.systemName || !this.imageUrl) {
      Swal.fire({
        icon: 'warning',
        title: 'حقول ناقصة',
        text: 'الرجاء ملء جميع الحقول المطلوبة.',
        confirmButtonText: 'حسنًا'
      });
      return;
    }

    const newData: SystemData = {
      systemName: this.systemName,
      image: this.imageUrl as string,
      listColor: this.listColor,
      textColor: this.textColor,
    };

    if (this.isEditing && this.currentEditingIndex !== null) {
      // تحديث البيانات الموجودة
      this.systemData[this.currentEditingIndex] = newData;
      this.isEditing = false;
      this.currentEditingIndex = null;

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث البيانات بنجاح.',
        confirmButtonText: 'حسنًا'
      });
    } else {
      // إضافة بيانات جديدة
      this.systemData.push(newData);

      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ',
        text: 'تم حفظ البيانات بنجاح.',
        confirmButtonText: 'حسنًا'
      });
    }

    // إعادة تعيين النموذج
    this.resetForm();
  }

  editData(index: number): void {
    const dataToEdit = this.systemData[index];
    this.systemName = dataToEdit.systemName;
    this.imageUrl = dataToEdit.image;
    this.listColor = dataToEdit.listColor;
    this.textColor = dataToEdit.textColor;
    this.isEditing = true;
    this.currentEditingIndex = index;

    // تمرير إلى أعلى الصفحة لرؤية النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteData(index: number): void {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استعادة هذه البيانات!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.systemData.splice(index, 1);

        // إذا تم حذف العنصر الذي يتم تعديله حاليًا، إعادة تعيين النموذج
        if (this.currentEditingIndex === index) {
          this.resetForm();
          this.isEditing = false;
          this.currentEditingIndex = null;
        }

        Swal.fire({
          icon: 'success',
          title: 'تم الحذف!',
          text: 'تم حذف البيانات بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }

  resetForm(): void {
    this.systemName = '';
    this.imageUrl = null;
    this.listColor = '#ffffff';
    this.textColor = '#000000';
    this.isEditing = false;
    this.currentEditingIndex = null;

    // إعادة تعيين مدخل الصورة
    const imageInput = document.getElementById('systemImage') as HTMLInputElement;
    if (imageInput) imageInput.value = '';
  }
}

import { Component } from '@angular/core';
import { SettingsComponent } from '../../settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-controls',
  standalone: true,
  imports: [RouterModule, SettingsComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './controls.component.html',
  styleUrls: ['./controls.component.scss'],
})
export class ControlsComponent {
  control = { name: '', code: '' }; // نموذج البيانات المدخلة
  controls: { id: number; name: string; code: string }[] = []; // مصفوفة البيانات
  isEditing: boolean = false;
  currentEditingIndex: number | null = null;

  // دالة لحفظ البيانات
  onSubmit() {
    if (!this.control.name || !this.control.code) {
      Swal.fire({
        icon: 'warning',
        title: 'حقول ناقصة',
        text: 'الرجاء ملء جميع الحقول قبل الحفظ.',
        confirmButtonText: 'حسنًا'
      });
      return;
    }

    if (this.isEditing && this.currentEditingIndex !== null) {
      // تحديث العنصر الحالي
      this.controls[this.currentEditingIndex] = {
        id: this.controls[this.currentEditingIndex].id,
        name: this.control.name,
        code: this.control.code,
      };
      this.isEditing = false;
      this.currentEditingIndex = null;

      Swal.fire({
        icon: 'success',
        title: 'تم التحديث',
        text: 'تم تحديث التحكم بنجاح.',
        confirmButtonText: 'حسنًا'
      });
    } else {
      // إضافة عنصر جديد
      const newControl = {
        id: this.controls.length + 1,
        name: this.control.name,
        code: this.control.code,
      };
      this.controls.push(newControl);

      Swal.fire({
        icon: 'success',
        title: 'تم الحفظ',
        text: 'تم حفظ التحكم بنجاح.',
        confirmButtonText: 'حسنًا'
      });
    }
    this.control = { name: '', code: '' }; // إعادة تعيين النموذج
  }

  // دالة لتعديل البيانات
  editControl(index: number) {
    this.control = { name: this.controls[index].name, code: this.controls[index].code };
    this.isEditing = true;
    this.currentEditingIndex = index;

    // التمرير إلى أعلى الصفحة لإتاحة رؤية النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // دالة لحذف البيانات
  deleteControl(index: number) {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استعادة هذه البيانات!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.controls.splice(index, 1);

        // إذا تم حذف العنصر الذي يتم تعديله حاليًا، إعادة تعيين حالة التعديل
        if (this.currentEditingIndex === index) {
          this.isEditing = false;
          this.currentEditingIndex = null;
          this.control = { name: '', code: '' };
        }

        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف التحكم بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }
}

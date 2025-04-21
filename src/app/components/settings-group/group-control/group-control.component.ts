import { Component } from '@angular/core';
import { SettingsComponent } from '../../settings/settings.component';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-control',
  standalone: true,
  imports: [SettingsComponent, FormsModule, CommonModule],
  templateUrl: './group-control.component.html',
  styleUrls: ['./group-control.component.scss']
})
export class GroupControlComponent {
  controlName: string = ''; // لحفظ اسم التحكم
  controls: string[] = ['Control 1', 'Control 2', 'Control 3']; // قائمة التحكمات المتاحة
  controlList: any[] = []; // لحفظ التحكمات المدخلة
  groupName: string = 'اسم المجموعة الثابت'; // اسم المجموعة ثابت

  isEditing: boolean = false; // حالة التعديل
  currentEditingIndex: number | null = null; // فهرس العنصر الذي يتم تعديله

  save(): void {
    if (this.controlName) {
      if (this.isEditing && this.currentEditingIndex !== null) {
        // تحديث العنصر الموجود
        this.controlList[this.currentEditingIndex].controlName = this.controlName;

        // إعادة تعيين حالة التعديل بعد التحديث
        this.isEditing = false;
        this.currentEditingIndex = null;

        // عرض رسالة تأكيد
        Swal.fire({
          icon: 'success',
          title: 'تم التحديث',
          text: 'تم تحديث التحكم بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      } else {
        // التحقق من عدم تكرار نفس التحكم في القائمة
        const exists = this.controlList.some(item => item.controlName === this.controlName);
        if (exists) {
          Swal.fire({
            icon: 'warning',
            title: 'تنبيه',
            text: 'هذا التحكم موجود بالفعل في المجموعة',
            confirmButtonText: 'حسنًا'
          });
          return;
        }

        // إضافة العنصر الجديد
        const newItem = {
          groupName: this.groupName, // إضافة اسم المجموعة الثابت
          controlName: this.controlName
        };
        this.controlList.push(newItem); // إضافة العنصر للمصفوفة

        // عرض رسالة تأكيد
        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ',
          text: 'تم إضافة التحكم بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
      this.controlName = ''; // مسح الحقول بعد الحفظ
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'تنبيه',
        text: 'يرجى اختيار اسم التحكم',
        confirmButtonText: 'حسنًا'
      });
    }
  }

  edit(index: number): void {
    this.controlName = this.controlList[index].controlName;
    this.isEditing = true;
    this.currentEditingIndex = index;

    // التمرير إلى أعلى الصفحة لإتاحة رؤية النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  delete(index: number): void {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استعادة هذا التحكم!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        // حذف العنصر بناءً على الفهرس
        this.controlList.splice(index, 1);

        // إذا تم حذف العنصر الذي يجري تعديله حاليًا، إلغاء التعديل
        if (this.currentEditingIndex === index) {
          this.isEditing = false;
          this.currentEditingIndex = null;
          this.controlName = '';
        } else if (this.currentEditingIndex !== null && index < this.currentEditingIndex) {
          // ضبط الفهرس إذا كان العنصر المحذوف قبل العنصر الذي يتم تعديله
          this.currentEditingIndex--;
        }

        // عرض رسالة تأكيد
        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف التحكم من المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }
}

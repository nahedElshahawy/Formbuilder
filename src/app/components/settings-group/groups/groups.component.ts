import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../../settings/settings.component';

import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-groups',
  standalone: true,
  imports: [SettingsComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.scss'], // تعديل هنا لإضافة حرف "s" الناقص
})
export class GroupsComponent implements OnInit {
  groupForm!: FormGroup; // نموذج البيانات
  groups: { name: string }[] = []; // مصفوفة لتخزين المجموعات المدخلة
  editIndex: number | null = null; // لتحديد العنصر الذي سيتم تعديله

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    this.groupForm = this.fb.group({
      groupuser: ['', [Validators.required, Validators.minLength(3)]], // إضافة التحقق
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;

      if (this.editIndex !== null) {
        // إذا كان هناك عنصر للتعديل، يتم تعديله
        this.groups[this.editIndex] = { name: formData.groupuser };
        this.editIndex = null; // إعادة تعيين index التعديل

        Swal.fire({
          icon: 'success',
          title: 'تم التحديث',
          text: 'تم تحديث المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      } else {
        // إذا كان جديدًا، يتم إضافته
        this.groups.push({ name: formData.groupuser });

        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ',
          text: 'تم إضافة المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }

      // إعادة تعيين النموذج بعد الإرسال
      this.groupForm.reset();
    } else {
      Swal.fire({
        icon: 'warning',
        title: 'حقول ناقصة',
        text: 'يرجى إكمال جميع الحقول المطلوبة.',
        confirmButtonText: 'حسنًا'
      });
    }
  }

  // تعديل مجموعة
  editGroup(index: number): void {
    this.editIndex = index;
    this.groupForm.setValue({
      groupuser: this.groups[index].name,
    });

    // التمرير إلى أعلى الصفحة لإتاحة رؤية النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  // حذف مجموعة
  deleteGroup(index: number): void {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استعادة هذه المجموعة!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفها!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.groups.splice(index, 1); // إزالة المجموعة من المصفوفة

        // إذا تم حذف العنصر الذي يتم تعديله حاليًا، إعادة تعيين حالة التعديل
        if (this.editIndex === index) {
          this.editIndex = null;
          this.groupForm.reset();
        }

        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }
}

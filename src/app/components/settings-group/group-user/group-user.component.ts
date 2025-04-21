import { Component, OnInit } from '@angular/core';
import { SettingsComponent } from '../../settings/settings.component';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-group-user',
  standalone: true,
  imports: [SettingsComponent, FormsModule, ReactiveFormsModule, CommonModule],
  templateUrl: './group-user.component.html',
  styleUrls: ['./group-user.component.scss'], // تعديل هنا لإضافة حرف "s" الناقص
})
export class GroupUserComponent implements OnInit {
  groupForm!: FormGroup; // Reactive form group
  groups: any[] = [];
  isEditing: boolean = false;
  currentEditingIndex: number | null = null;

  constructor(private fb: FormBuilder) { }

  ngOnInit(): void {
    // Initializing the reactive form
    this.groupForm = this.fb.group({
      groupuser: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.groupForm.valid) {
      const formData = this.groupForm.value;

      if (this.isEditing && this.currentEditingIndex !== null) {
        // تحديث المجموعة الحالية
        this.groups[this.currentEditingIndex].user = formData.groupuser;
        this.isEditing = false;
        this.currentEditingIndex = null;

        Swal.fire({
          icon: 'success',
          title: 'تم التحديث',
          text: 'تم تحديث المستخدم في المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      } else {
        // إضافة مجموعة جديدة
        const newGroup = {
          name: `المجموعة ${this.groups.length + 1}`, // يمكنك تعديل هذا لتعيين اسم مجموعة حقيقي
          user: formData.groupuser,
        };
        this.groups.push(newGroup);

        Swal.fire({
          icon: 'success',
          title: 'تم الحفظ',
          text: 'تم إضافة المستخدم إلى المجموعة بنجاح.',
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

  editGroup(index: number): void {
    this.currentEditingIndex = index;
    this.isEditing = true;
    this.groupForm.setValue({
      groupuser: this.groups[index].user,
    });

    // التمرير إلى أعلى الصفحة لإتاحة رؤية النموذج
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  deleteGroup(index: number): void {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: 'لن تتمكن من استعادة هذا المستخدم من المجموعة!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.groups.splice(index, 1); // إزالة المجموعة من المصفوفة

        // إذا تم حذف العنصر الذي يتم تعديله حاليًا، إعادة تعيين حالة التعديل
        if (this.currentEditingIndex === index) {
          this.isEditing = false;
          this.currentEditingIndex = null;
          this.groupForm.reset();
        }

        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف المستخدم من المجموعة بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }
}

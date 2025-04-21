import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, OnInit } from '@angular/core';
import { CdkDrag,CdkDropList, CdkDragDrop, CdkDragRelease, CdkDragStart, DragDropModule, CdkDragPlaceholder } from '@angular/cdk/drag-drop';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatListModule } from '@angular/material/list';;

interface FormField {
  label: any;
  type: any;
  placeholder?: string;
  icon?: string;
  options?: string[];
  value?: string | number | boolean | Text;
  Governments?: string[];
  cities?: string[];
  GovenmentValue?: string;
  cityValue?: string;
  name?:any;
}

@Component({
  selector: 'app-basics',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatTooltipModule,
    MatListModule,
    DragDropModule,
    CdkDrag,
    CdkDropList,
    NgFor,
    ReactiveFormsModule,
    MatFormFieldModule,
    CdkDragPlaceholder,
    MatInput
  ],
  providers:[  NgModel],
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  schemas: [CUSTOM_ELEMENTS_SCHEMA]


})
export class Basics4Component implements OnInit {
  // مصفوفة الحقول التي ستُوضَع في النموذج
formFields: FormField[] = [];

// الحقول المتاحة للسحب
availableFields: FormField[] = [
{ label: "Full Name", type: 'text', placeholder: 'Enter Full Name', icon: 'account_circle', value: '' },
{ label: 'Email', type: 'email', placeholder: 'Enter Email', icon: 'email', value: '' },
{ label: 'Date', type: 'date', icon: 'calendar_today', value: '' },
{ label: 'Governments', type: 'select', options: ['القاهرة', 'الاسكندرية', 'دمياط'], icon: 'public', value: '' },
{ label: 'Religion', type: 'radio', options: ['مسلم', 'مسيحى'], icon: 'group', value: '' },
{ label: 'Gender', type: 'radio', options: ['Male', 'Female'], icon: 'wc', value: '' },
{ label: 'Subscribe', type: 'checkbox', icon: 'notifications', value: false },
{ label: 'National ID', type: 'number', placeholder: 'Enter National ID', icon: 'fingerprint', value: '' }
];

// أمثلة للبيانات الحكومية والمدن
Governments = ['القاهرة', 'الاسكندرية', 'دمياط'];
cities: any = {
القاهرة: ['مدينة نصر', 'الهرم'],
الاسكندرية: ['العجمى', 'البحر'],
دمياط: ['دمياط الجديدة', 'فارسكور']
};

draggedField: FormField | null = null;

constructor() { }

ngOnInit(): void { }

// عند بدء السحب
onDragStart(event: CdkDragStart, field: FormField): void {
this.draggedField = field;
console.log('Drag Started: ', field.label);
}

// عند انتهاء السحب
onDragEnd(event: CdkDragRelease): void {
this.draggedField = null;
console.log('Drag Ended');
}

// عند الإفلات في منطقة الفورم
onDrop(event: CdkDragDrop<FormField[]>): void {
if (this.draggedField) {
const isFieldAlreadyAdded = this.formFields
.some(field => field.label === this.draggedField?.label);
if (!isFieldAlreadyAdded) {
const newField = { ...this.draggedField };
// تأكدي من إفراغ الـvalue إن أردتِ:
newField.value = (newField.type === 'checkbox') ? false : '';
this.formFields.push(newField);
}
}
}

// تغيير الحكومة يغير الخيارات المتاحة للمدينة
onGovernmentChange(field: FormField): void {
if (field.GovenmentValue) {
field.cities = this.cities[field.GovenmentValue] || [];
field.cityValue = ''; // إعادة تعيين المدينة
}
}

// عند ضغط زر Submit
onSubmit(): void {
const formData: any = {};
this.formFields.forEach(field => {
formData[field.label] = field.value;
});
console.log('Form Data:', formData);
}
}

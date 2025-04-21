import { CdkDrag, CdkDragDrop, CdkDragPlaceholder, CdkDragRelease, CdkDragStart, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { CommonModule, NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule, MatPrefix } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInput, MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { MatTooltipModule } from '@angular/material/tooltip';


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
  selector: 'app-simple-drag-drop',
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
    MatInput,MatPrefix
  ],
    templateUrl: './simple-drag-drop.component.html',
  styleUrl: './simple-drag-drop.component.scss'
})
export class SimpleDragDropComponent {



// مصفوفة الحقول (التي يستخدمها المستخدم في النموذج)
formFields: FormField[] = [];

// الحقول المتاحة للسحب
availableFields: FormField[] = [
{ label: 'Full Name', type: 'text', placeholder: 'Enter Full Name', icon:'account_circle', value: '' },
{ label: 'Email', type: 'email', placeholder: 'Enter Email', icon:'email', value: '' },
{ label: 'Date', type: 'date', placeholder: 'Select a Date', icon:'calendar_today', value: '' },
{ label: 'City', type: 'select', placeholder: 'Select City', icon:'location_city',
options: ['New York', 'London', 'Tokyo'], value: '' },
{ label: 'Gender', type: 'radio', placeholder: '', icon: 'wc',
options: ['Male', 'Female'], value: '' },
{ label: 'Subscribe', type: 'checkbox',placeholder: '', icon: 'notifications', value: false },
{ label: 'National ID',type: 'number', placeholder: 'Enter National ID',icon: 'fingerprint', value: '' },
];

draggedField: FormField | null = null;

constructor() {}

ngOnInit(): void {}

// عند بدء السحب
onDragStart(event: CdkDragStart, field: FormField): void {
this.draggedField = field;
console.log('Drag Started:', field.label);
}

// عند انتهاء السحب
onDragEnd(event: CdkDragRelease): void {
this.draggedField = null;
console.log('Drag Ended');
}

// عند الإفلات في منطقة الفورم
onDrop(event: CdkDragDrop<FormField[]>): void {
  if (event.previousContainer === event.container) {

if (this.draggedField) {
// نفحص إن كان هذا الحقل موجودًا مسبقًا حتى لا نضيفه أكثر من مرة
const alreadyExists = this.formFields.some(f => f.label === this.draggedField?.label);
if (!alreadyExists) {
// انسخ الحقل
const newField: FormField = { ...this.draggedField };
// إذا أردت تهيئة القيمة من جديد:
newField.value = (newField.type === 'checkbox') ? false : '';
// أضف الحقل إلى القائمة
this.formFields.push(newField);
}
}}
}





// عند الضغط على Submit
onSubmit(): void {
const data: any = {};
this.formFields.forEach((field) => {
data[field.label] = field.value;
});
console.log('Form Data:', data);
alert('Data in console!');
}
}

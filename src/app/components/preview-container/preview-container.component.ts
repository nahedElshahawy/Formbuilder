import { ChangeDetectionStrategy, Component, CUSTOM_ELEMENTS_SCHEMA, Input, OnInit } from '@angular/core';
import { CdkDrag, CdkDragStart, CdkDragDrop, CdkDragRelease, CdkDropList, DragDropModule, moveItemInArray, transferArrayItem, CDK_DROP_LIST } from '@angular/cdk/drag-drop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { BrowserAnimationsModule, NoopAnimationsModule } from '@angular/platform-browser/animations';
import { trigger, transition, style, animate } from '@angular/animations';
import { DataService } from '../../services/data.service';  // تأكدي من استيراد الخدمة بشكل صحيح
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { MatIconModule } from '@angular/material/icon';
import { MatError, MatFormField, matFormFieldAnimations, MatSuffix } from '@angular/material/form-field';
import { MatDatepickerActions, MatDatepickerModule, MatDatepickerToggle, MatDatepickerToggleIcon, MatDateRangeInput, MatDateRangePicker } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatOptionModule } from '@angular/material/core';
import { MatHeaderRow, MatTextColumn } from '@angular/material/table';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { EgyptianIdValidatorService } from '../../services/egyptian-id-validator.service';
import { MatCardModule } from '@angular/material/card';
import { debounceTime, map, switchMap, catchError } from 'rxjs/operators';
import { BasicsComponent } from '../side group/basics/basics.component';
import { ActivatedRoute, Router } from '@angular/router';
import { FormDataService } from '../../services/form-data.service';
import { ExportService } from '../../services/export.service';  // استيراد الخدمة





interface FormField {
  label: string;
  type: string; // Type of the input (text, select, radio, etc.)
  placeholder?: string;
  icon?: string;
  options?: string[]; // For select, radio, checkbox options
  value?: string | number | boolean | Headers;
  Governments?: string[]; // For countries
  cities?: string[]; // For cities
  GovenmentValue?: string; // To hold the selected country
  cityValue?: string; // To hold the selected 
  isRequired?: boolean;
  accept?: string;
}

interface City {
  id: string;
  city_name_ar: string;
  city_name_en: string; // يمكن إضافة الحقول الأخرى إذا كنت تحتاجها
  governorate_id: string;
}

interface Government {
  id: string;
  governorate_name_ar: string;
  governorate_name_en: string;


}

@Component({
  selector: 'app-test',
  standalone: true,
  providers: [



    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    EgyptianIdValidatorService,
    HttpClientModule,
    DataService,
    DragDropModule,
    ExportService

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  imports: [
    NgFor,
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatCheckboxModule,
    NgIf, CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatIconModule,
    MatRadioModule,
    MatCheckboxModule,
    HttpClientModule,
    MatDatepickerModule,
    DragDropModule,
    MatCardModule,
    CdkDrag,
    CommonModule,
    BasicsComponent, NgClass

  ],


  templateUrl: './preview-container.component.html',
  styleUrls: ['./preview-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 0 }))
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ])
  ]
})


export class PreviewContainerComponent implements OnInit {

  formData: any;
  viewType: string = '';

  basicFields: any[] = [];
  additionalFields: any[] = [];



  title = "انشاء صفحة البيانات ";
  selectedDate: Date = new Date();
  form: FormGroup | any;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedFile: File | null = null;
  formFields: FormField[] = [];
  governments: Government[] = [];
  cities: City[] = [];
  selectedGovernmentId: string | null = null;
  selectedCityId: string | null = null;




  ngOnInit() {

    // الاشتراك في الـ Observable للحصول على البيانات
    this.formDataService.getBasicFields().subscribe(fields => {
      this.basicFields = fields;
    });

    this.formDataService.getAdditionalFields().subscribe(fields => {
      this.additionalFields = fields;
    });
  

    // قراءة المعلمات المرسلة عبر الرابط
    this.route.queryParams.subscribe(params => {
      if (params['data']) {
        this.formData = JSON.parse(params['data']);
      }
      if (params['view']) {
        this.viewType = params['view'];  // تحديد طريقة العرض
      }
    });
  }


  goBack() {
    this.router.navigate(['/basics']);  // العودة إلى الصفحة الرئيسية
  }

  constructor(
    private formDataService: FormDataService,
    private dataService: DataService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router,
    private fb: FormBuilder,
    private exportService: ExportService,
    private egyptianIdValidatorService: EgyptianIdValidatorService) {
    this.loadGovernments();

 
  }

  onExportRequested() {
    this.exportService.exportForm();  // استدعاء الدالة من الخدمة
  }

  
  loadGovernments() {
    this.dataService.getGovernments().subscribe(governments => {
      console.log(governments);  // Check if data is fetched correctly
      this.governments = governments;
    });
  }
  loadCities(governmentId: string) {
    this.dataService.getCities().subscribe(cities => {
      console.log(cities);  // Check if data is fetched correctly
      this.cities = cities.filter((city: any) => city.governorate_id === governmentId);
    });
  }


  // @Input() formFieldPreview: any[] = []; // الحقول التي سيتم عرضها في المعاينة


  // عند اختيار محافظة جديدة
  onGovernorateChange(governmentId: string) {
    this.selectedGovernmentId = governmentId;
    this.loadCities(governmentId);  // تحديث قائمة المدن بناءً على المحافظة
  }

  // Method to set the rating when a star is clicked
  setRating(rating: number): void {
    const field = this.formFields.find(f => f.label === 'Rating');
    if (field) {
      field.value = rating; // Update the rating value
    }
  }

  getRatingValue(field: FormField): number {
    return typeof field.value === 'number' ? field.value : 0; // fallback to 0 if not a number
  }


  deleteField(index: number): void {
    // Remove the field from the formFields array
    this.formFields.splice(index, 1);
  }

  // Method to edit a field (you can implement your custom logic here)
  editField(index: number): void {
    const field = this.formFields[index];
    if (field) {
      // For now, let's just log the field to the console
      console.log('Editing field:', field);
    }
  }



  hoveredField: any = null;

  

  onSubmit(): void {
    if (this.form) {
      const formData = this.form.value;

      const jsonData = JSON.stringify(formData, null, 2);

      const blob = new Blob([jsonData], { type: 'application/json' });

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'formData.json';  // Name of the file to download

      link.click();


    }

  }










  selectedFields = this.basicFields; // بدايةً، يمكن أن تكون `selectedFields` هي نفسها `basicFields`

  // دالة لتصفية الحقول المختارة فقط
  getSelectedFields() {
    return this.basicFields.filter(field => field.isSelected);
  }

  // دالة لتصدير النموذج أو أي وظيفة أخرى
  exportForm() {
    const htmlContent = document.querySelector('.preview-container')?.innerHTML;
    const styleContent = document.head.innerHTML;
    const blob = new Blob([`<html><head>${styleContent}</head><body>${htmlContent}</body></html>`],
      { type: 'text/html' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'exported_form.html';
    a.click();
  }

  
}




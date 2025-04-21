import { ChangeDetectionStrategy, ChangeDetectorRef, Component, CUSTOM_ELEMENTS_SCHEMA, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors, AsyncValidatorFn, FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';
import { MatSelectModule } from '@angular/material/select';
import { trigger, transition, style, animate } from '@angular/animations';
import * as QRCode from 'qrcode';
// import { LocationService } from '../../services/location.service';

import { DataService } from '../../../services/data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_FORMATS, MAT_DATE_LOCALE, MatNativeDateModule, MatOptionModule, NativeDateAdapter } from '@angular/material/core';
import { MatCardModule } from '@angular/material/card';
import { Router, RouterModule } from '@angular/router';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { FormDataService } from '../../../services/form-data.service';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { v4 as uuidv4 } from 'uuid';
import Swal from 'sweetalert2';

import { Observable, of } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { ActivityService } from '../../../services/activity.service';
import { EgyptianIdValidatorService } from '../../../services/egyptian-id-validator.service';
import { Language, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { LanguageSwitcherComponent } from '../../language-switcher/language-switcher.component';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Script } from 'vm';
import { MyPagesComponent } from '../my-pages/my-pages.component';





interface FormField {
  id?: string;
  label: string;
  name?: string;

  type: string;
  placeholder?: string;
  icon: string;
  options?: string[];
  value?: any;
  Governments?: string[];
  cities?: string[];
  GovenmentValue?: any;
  cityValue?: any;
  isRequired?: boolean;
  accept?: string;
  model?: string;
  minLength?: number;
  maxLength?: number;
  questionLabel?: string | any;

}

interface City {
  id: string;
  city_name_ar: string;
  city_name_en: string;
  governorate_id: string;
}

interface Government {
  id: string;
  governorate_name_ar: string;
  governorate_name_en: string;
}

@Component({
  selector: 'app-basics',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatSelectModule,
    MatOptionModule,
    MatRadioModule,
    MatCheckboxModule,
    MatIconModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    SidebarComponent,
    HttpClientModule,
    DragDropModule,
    MyPagesComponent


  ],
  providers: [

    { provide: MAT_DATE_FORMATS, useValue: MAT_DATE_FORMATS },
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    EgyptianIdValidatorService,
    HttpClientModule,
    DataService,
    RouterModule,
    ActivityService,
    TranslateService, TranslateModule,
    TranslateHttpLoader,
    TranslateStore

  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './basics.component.html',
  styleUrls: ['./basics.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  animations: [
    trigger('transitionMessages', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('0.5s', style({ opacity: 1 }))
      ]),
      transition(':leave', [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ])
  ]
})
export class BasicsComponent implements OnInit {

  // Add these new properties:
  uploadedFile: File | null = null;
  uploadedFileName: string = '';
  uploadedFileSize: string = '';
  uploadedFileUrl: string | ArrayBuffer | null = null;
  maritalStatusOptions = ['Single', 'Married', 'Divorced', 'Widowed'];
  selectedMaritalStatus: string | null = null;


  dialogVisible = false;
  title = "إنشاء صفحة البيانات";
  form: FormGroup;
  stars: number[] = [1, 2, 3, 4, 5];
  selectedFile: File | null = null;

  gender: string | null = null;
  birthDate: Date | null = null;

  governorate: string | null = null;
  centerOrCity: string | null = null;


  basicFields: FormField[] = [
    { label: "FullName", type: 'string', placeholder: 'الاسم بالكامل', icon: 'account_circle', minLength: 3, id: 'fullName' },
    { label: 'nationalId', type: 'int', placeholder: 'ادخل الرقم القومي / Enter National ID', icon: 'person' },
    { label: 'Email', type: 'email', placeholder: 'البريد الالكترونى', icon: 'email' },
    { label: 'Phone', type: 'string', placeholder: 'ادخل رقم الموبايل', icon: 'phone' },
    { label: 'Date', type: 'Date', placeholder: 'اختر التاريخ', icon: 'calendar_today' },
    { label: 'Gender', type: 'radio', options: ['Male', 'Female'], icon: 'wc' },
    { label: 'Religion', type: 'radio', options: ['Muslim', 'Christian'], icon: 'group' },
    { label: 'Governments', type: 'Governments', placeholder: 'اختر المحافظة', icon: 'public', model: 'selectedGovernmentId' },
  ];

  additionalFields: FormField[] = [
    { label: "Text", type: 'text', placeholder: 'Enter Text', icon: 'text_fields' },
    { label: "Header", type: 'head', placeholder: 'Enter Header', icon: 'info' },
    { label: "Paragraph", type: 'textarea', placeholder: 'Enter Paragraph', icon: 'description' },

    // File upload fields
    { label: "File Upload", type: 'file', placeholder: 'Upload Document', icon: 'file_upload', accept: '.pdf,.doc,.docx,.txt' },
    { label: "ID", type: 'image', placeholder: 'Upload ID', icon: 'photo_camera', accept: 'image/*' },

    // Personal information fields
    { label: "Marital Status", type: 'radio', options: ['Single', 'Married', 'Divorced', 'Widowed'], icon: 'people' },
    { label: "Time", type: 'time', placeholder: 'Select Time', icon: 'access_time' },

    // Rating and questions
    { label: "Rating", type: 'Rate', placeholder: 'قم بتقييم تجربتك', questionLabel: 'كيف تقيم خدمتنا؟', icon: 'star', value: 0 }, { label: "Question", type: 'text', placeholder: 'Enter Question', icon: 'question_answer' },
    { label: "Yes/No ", type: 'radio', options: ['Yes', 'No'], icon: 'check_box' },
    { label: "Multiple Choice", type: 'radio', options: ['Option 1', 'Option 2', 'Option 3'], icon: 'check_box' },
    { label: "Single Q", type: 'text', placeholder: 'Enter Single Answer', icon: 'question_answer' },
    { label: "Multi Answer", type: 'textarea', placeholder: 'Enter Multiple Answers Questions', icon: 'question_answer' },
    // { label: "Question",  type: 'Question', placeholder: 'اكتب سؤالك هنا...', questionLabel: 'السؤال:', icon: 'question_answer' },
    // Submit button
    { label: "Submit", type: 'submit', placeholder: '', icon: 'send' }
  ];


  formFields: FormField[] = [];

  governments: Government[] = [];
  cities: City[] = [];
  selectedGovernmentId: string | null = null;
  selectedCityId: string | null = null;

  showPreview: boolean = false;
  previewVisible: boolean = false;

  draggedField: FormField | null = null;

  scale: number = 1;

  currentLang: string = '';




  constructor(
    // public translate:TranslateService,
    private dialog: MatDialog,
    private formDataService: FormDataService,
    private dataService: DataService,
    private cdr: ChangeDetectorRef,
    private fb: FormBuilder,
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object

  ) {
    this.loadGovernments();


    this.formDataService.updateBasicFields(this.basicFields);
    this.formDataService.updateAdditionalFields(this.additionalFields);

    this.form = this.fb.group({
      governorate: [''],
      city: [''],
      nationalId: ['', [], [this.egyptianNationalIdValidator()]],
      email: ['', [Validators.email]],
      phone: ['', [Validators.pattern(/^0[0-9]{10}$/)]],
      dateField: ['']
    });
  }

  ngOnInit(): void {


    this.form.get('nationalId')?.valueChanges.subscribe(value => {
      if (value && value.length === 14) {
        const genderDigit = parseInt(value.charAt(12), 10);
        this.gender = genderDigit % 2 === 0 ? 'أنثى' : 'ذكر';

        const centuryCode = parseInt(value.charAt(0), 10);
        const yearPart = parseInt(value.substring(1, 3), 10);
        const month = parseInt(value.substring(3, 5), 10);
        const day = parseInt(value.substring(5, 7), 10);

        let fullYear = 1900 + yearPart;
        if (centuryCode === 2) {
          fullYear = 1900 + yearPart;
        } else if (centuryCode === 3) {
          fullYear = 2000 + yearPart;
        }

        this.birthDate = new Date(fullYear, month - 1, day);

        this.dataService.getGovernments().subscribe(governments => {
          const governorateCode = value.substring(7, 9);
          const governorate = governments.find(gov => gov.id === governorateCode);
          this.governorate = governorate ? governorate.governorate_name_ar : 'محافظة غير معروفة';
        });
      } else {
        this.gender = null;
        this.birthDate = null;
        this.governorate = null;
      }

    });


  }

  loadGovernments() {
    this.dataService.getGovernments().subscribe(governments => {
      console.log("Governments Loaded:", governments);
      this.governments = governments;
    });
  }

  loadCities(governmentId: any) {
    this.dataService.getCities().subscribe(cities => {
      console.log("All Cities Loaded:", cities);
      this.cities = cities.filter((city: any) => city.governorate_id === governmentId);
      console.log("Filtered Cities:", this.cities);
      this.cdr.detectChanges(); // Force update
    });
  }

  governmentId: any;


  onGovernorateChange(event: any) {
    const governmentId = event.target.value;
    console.log("Selected Governorate ID:", governmentId);

    this.selectedGovernmentId = governmentId;
    this.loadCities(governmentId);
  }


  onDragStart(event: DragEvent, field: FormField): void {
    this.draggedField = field;
    event.dataTransfer?.setData('text', JSON.stringify(field));
  }

  onDragEnd(event: DragEvent): void {
    this.draggedField = null;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();

    if (this.draggedField) {
      const newField = { ...this.draggedField, value: '' };

      newField.id = uuidv4();

      this.formFields.push(newField);

      let validators = [];

      if (newField.isRequired) {
        validators.push(Validators.required);
      }

      if (newField.type === 'email') {
        validators.push(Validators.email);
      }

      if (newField.type === 'number') {
        validators.push(Validators.pattern('^[0-9]*$'));
      }

      if (newField.minLength) {
        validators.push(Validators.minLength(newField.minLength));
      }

      this.form.addControl(
        newField.label,
        new FormControl('', validators)
      );

      this.form.get(newField.label)?.setValidators(validators);
      this.form.get(newField.label)?.updateValueAndValidity();
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  deleteField(index: number): void {
    const field = this.formFields[index];
    this.formFields.splice(index, 1);
    this.form.removeControl(field.label);
  }

  editField(index: number): void {
    const field = this.formFields[index];
    if (field) {
      console.log('Editing field:', field);
    }
  }




  // onDragEnter(event: any, type: 'image' | 'file'): void {
  //   event.preventDefault();
  //   if (type === 'image') {
  //     event.currentTarget.classList.add('dragover');
  //   } else {
  //     event.currentTarget.classList.add('dragover');
  //   }
  // }

  // onDragLeave(event: any, type: 'image' | 'file'): void {
  //   event.preventDefault();
  //   if (type === 'image') {
  //     event.currentTarget.classList.remove('dragover');
  //   } else {
  //     event.currentTarget.classList.remove('dragover');
  //   }
  // }
  hoveredField: any = null;

  onMouseEnter(field: any) {
    this.hoveredField = field;
  }

  onMouseLeave() {
    this.hoveredField = null;
  }

  imageUrl: string | ArrayBuffer | null = null;







  onImageDrop(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file) {
      const allowedImageTypes = ['image/gif', 'image/png', 'image/jpg', 'image/jpeg'];
      const maxImageSizeInBytes = 5 * 1024 * 1024; // 5 ميجابايت

      if (!allowedImageTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'نوع ملف غير مدعوم',
          text: 'الرجاء سحب صورة بامتداد مدعوم.',
          confirmButtonText: 'حسنًا'
        });
        return;
      }

      if (file.size > maxImageSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'حجم الملف كبير جدًا',
          text: 'حجم الملف أكبر من 5 ميجابايت. الرجاء اختيار صورة أصغر.',
          confirmButtonText: 'حسنًا'
        });
        return;
      }

      // قراءة الصورة وعرضها
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imageUrl = e.target.result;
      };
      reader.readAsDataURL(file);

      console.log('تم تحميل صورة عبر السحب والإفلات:', file);
    }
  }

  onFileDrop(event: any): void {
    event.preventDefault();
    const file = event.dataTransfer.files[0];

    if (file) {
      const allowedFileTypes = [
        'application/pdf',
        'text/plain',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
        'application/msword', // .doc
        // إضافة أنواع أخرى من الملفات حسب الحاجة
      ];
      const maxFileSizeInBytes = 10 * 1024 * 1024; // 10 ميجابايت

      if (!allowedFileTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'نوع ملف غير مدعوم',
          text: 'الرجاء سحب ملف بامتداد مدعوم.',
          confirmButtonText: 'حسنًا'
        });
        return;
      }

      if (file.size > maxFileSizeInBytes) {
        Swal.fire({
          icon: 'error',
          title: 'حجم الملف كبير جدًا',
          text: 'حجم الملف أكبر من 10 ميجابايت. الرجاء اختيار ملف أصغر.',
          confirmButtonText: 'حسنًا'
        });
        return;
      }

      console.log('تم تحميل ملف عبر السحب والإفلات:', file);
    }
  }







  // أضف هذه الخصائص للفئة
  idFrontUrl: string | ArrayBuffer | null = null;
  idBackUrl: string | ArrayBuffer | null = null;
  idFrontFile: File | null = null;
  idBackFile: File | null = null;

  // دالة لتحميل صورة الهوية الأمامية
  onIdFrontChange(event: any): void {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'نوع ملف غير مدعوم',
          text: 'الرجاء تحميل صورة بامتداد jpeg, jpg, أو png',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'حجم الملف كبير جدًا',
          text: 'حجم الصورة يجب أن لا يتجاوز 2 ميجابايت',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = '';
        return;
      }

      this.idFrontFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.idFrontUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  // دالة لتحميل صورة الهوية الخلفية
  onIdBackChange(event: any): void {
    const file = event.target.files[0];
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    const maxSize = 2 * 1024 * 1024; // 2MB

    if (file) {
      if (!allowedTypes.includes(file.type)) {
        Swal.fire({
          icon: 'error',
          title: 'نوع ملف غير مدعوم',
          text: 'الرجاء تحميل صورة بامتداد jpeg, jpg, أو png',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = '';
        return;
      }

      if (file.size > maxSize) {
        Swal.fire({
          icon: 'error',
          title: 'حجم الملف كبير جدًا',
          text: 'حجم الصورة يجب أن لا يتجاوز 2 ميجابايت',
          confirmButtonText: 'حسنًا'
        });
        event.target.value = '';
        return;
      }

      this.idBackFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.idBackUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }


  // أضف هذه الدوال للفئة
  onIdFrontDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const fakeEvent = { target: { files: event.dataTransfer.files } };
      this.onIdFrontChange(fakeEvent);
    }
  }

  onIdBackDrop(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer?.files) {
      const fakeEvent = { target: { files: event.dataTransfer.files } };
      this.onIdBackChange(fakeEvent);
    }
  }





  // Handle file selection
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (!file) return;

    const allowedTypes = ['application/pdf', 'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (!allowedTypes.includes(file.type)) {
      Swal.fire({
        icon: 'error',
        title: 'Invalid File Type',
        text: 'Please upload PDF, Word, or Text documents only',
        confirmButtonText: 'OK'
      });
      return;
    }

    if (file.size > maxSize) {
      Swal.fire({
        icon: 'error',
        title: 'File Too Large',
        text: 'Maximum file size is 5MB',
        confirmButtonText: 'OK'
      });
      return;
    }

    this.uploadedFile = file;
    this.uploadedFileName = file.name;
    this.uploadedFileSize = (file.size / 1024).toFixed(2) + ' KB';

    const reader = new FileReader();
    reader.onload = (e) => {
      this.uploadedFileUrl = e.target?.result || null;
    };
    reader.readAsDataURL(file);
  }

  // Remove uploaded file
  removeUploadedFile(): void {
    this.uploadedFile = null;
    this.uploadedFileName = '';
    this.uploadedFileSize = '';
    this.uploadedFileUrl = null;
  }



  // دالة لحذف صورة الهوية الأمامية
  removeIdFront(): void {
    this.idFrontUrl = null;
    this.idFrontFile = null;
    // يمكنك إضافة كود لإعادة تعيين عنصر الإدخال إذا لزم الأمر
  }

  // دالة لحذف صورة الهوية الخلفية
  removeIdBack(): void {
    this.idBackUrl = null;
    this.idBackFile = null;
    // يمكنك إضافة كود لإعادة تعيين عنصر الإدخال إذا لزم الأمر
  }




  getQRCodeSize(): number {
    // يمكنك تعيين الحجم كما تحب
    return 256;
  }

  // 1) المتغير الذي يحمل الرابط المطلوب تضمينه في الـ QR
  // qrLink: string = 'file:///C:/Users/IISC/Downloads/exported_form.html';

  // qrLink: string = ' http://192.168.x.x:8080/exported_form.html';



  qrLink: string = ' http://192.168.x.x:8080/exported_form.html';

  hostedLink: string = 'https://api-ocr.egcloud.gov.eg/exported_form.html';
  // 2) سيحتوي على بيانات الصورة (DataURL) بعد التوليد
  qrCodeImage: string = '';


  // دالة صغيرة لتوليد الـ QR
  generateQR(): void {
    QRCode.toDataURL(this.qrLink, {
      errorCorrectionLevel: 'M',
      width: 256
    })
      .then(url => {
        // url عبارة عن DataURL (Base64) لصورة الـQR
        this.qrCodeImage = url;
        // في حال أردت طبع الرابط في الكونسول:
        // console.log('QR Code DataURL:', url);
      })
      .catch(err => {
        console.error('خطأ عند توليد الـ QR:', err);
        Swal.fire('Error', 'Failed to generate QR code.', 'error');
      });
  }


  // private generateQR(link: string): void {
  //   QRCode.toDataURL(link, { width: 256 })
  //   .then(url => {
  //   this.qrCodeImage = url;
  //   })
  //   .catch(err => {
  //   console.error('خطأ في توليد QR:', err);
  //   });
  //   }
  // إضافة الدالة onSubmit
  onSubmit(): void {
    if (this.form.valid) {
      console.log('Form submitted:', this.form.value);

      // this.router.navigate(['/my-pages'], { state: { formData: this.form.value } });

      // يمكنك إضافة منطق إرسال البيانات إلى الخادم هنا
    } else {
      this.displayFormErrors();
      console.log('Form is invalid');
    }


    this.generateQR();

  }

  displayFormErrors() {
    Object.keys(this.form.controls).forEach(key => {
      const control = this.form.get(key);
      control?.markAsTouched();
      control?.updateValueAndValidity();
    });
  }


  // Method to set the rating when a star is clicked
  setRating(rating: number): void {
    const field = this.formFields.find(f => f.label === 'Rating');
    if (field) {
      field.value = rating; // Update the rating value
    }
  }

  // Ensure that the value is a number when reading it in the template
  getRatingValue(field: FormField): number {
    return typeof field.value === 'number' ? field.value : 0; // fallback to 0 if not a number
  }


  // إضافة الدوال للتحكم في حجم المعاينة
  increaseSize(): void {
    if (this.scale < 1.5) {
      this.scale += 0.1;
      this.applyScale();
    }
  }

  decreaseSize(): void {
    if (this.scale > 0.8) {
      this.scale -= 0.1;
      this.applyScale();
    }
  }

  applyScale(): void {
    const previewContainer = document.querySelector('.preview-container') as HTMLElement;
    if (previewContainer) {
      previewContainer.style.transform = `scale(${this.scale})`;
      previewContainer.style.transformOrigin = 'top center';
    }
  }

  // التحقق المخصص للرقم القومي المصري
  egyptianNationalIdValidator(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const id = control.value;

      if (!id) return of(null);

      const idPattern = /^[23][0-9]{13}$/;
      if (id.length !== 14 || !idPattern.test(id)) {
        return of({ invalidId: 'الرقم القومي يجب أن يكون مكونًا من 14 رقمًا ويبدأ بـ 2 أو 3' });
      }

      const centuryCode = parseInt(id.charAt(0), 10);
      const yearPart = parseInt(id.substring(1, 3), 10);
      const month = parseInt(id.substring(3, 5), 10);
      const day = parseInt(id.substring(5, 7), 10);

      let fullYear = 1900 + yearPart;
      if (centuryCode === 2) {
        fullYear = 1900 + yearPart;
      } else if (centuryCode === 3) {
        fullYear = 2000 + yearPart;
      } else {
        return of({ invalidCentury: 'كود القرن غير صالح' });
      }

      if (!this.isValidDate(day, month, fullYear)) {
        return of({ invalidBirthdate: 'تاريخ الميلاد غير صالح' });
      }

      if (new Date(fullYear, month - 1, day) > new Date()) {
        return of({ invalidBirthdate: 'تاريخ الميلاد لا يمكن أن يكون في المستقبل' });
      }

      const governorateCode = id.substring(7, 9);

      return this.dataService.getGovernments().pipe(
        map((governments: Government[]) => {
          const governorate = governments.find(gov => gov.id === governorateCode);
          if (!governorate) {
            return { invalidGovernorate: 'كود المحافظة غير صالح' };
          }
          return null;
        }),
        catchError(() => of({ invalidGovernorate: 'حدث خطأ في جلب بيانات المحافظات' }))
      );
    };
  }




  private isValidDate(day: number, month: number, year: number): boolean {
    const date = new Date(year, month - 1, day);
    return (
      date.getFullYear() === year &&
      date.getMonth() === month - 1 &&
      date.getDate() === day
    );
  }




  // Helper function to translate labels to English
  translateLabel(label: string): string {
    const translations: { [key: string]: string } = {
      'الاسم بالكامل': 'Full Name',
      'ادخل الرقم القومي': 'Enter National ID',
      'البريد الإلكتروني': 'Email',
      'ادخل رقم الموبايل': 'Enter Mobile Number',
      'اختر التاريخ': 'Select Date',
      'اختر المحافظة': 'Select Governorate',
      'اختر المدينة': 'Select City',
      'الديانة': 'Religion',
      'الجنس': 'Gender',
      'Marital Status':'الحالة الاجتماعية',

      'ادخل النص': 'Enter Text',
      'ادخل عنوان ': 'Enter Header',
      'اكتب عن موضوع ': 'Enter Paragraph',
      'ارفع ملف ': 'Upload File',
      'تحميل صورة البطاقة الامامية ': 'ID Front',
      'تحميل صورة البطاقة الخلفية ': 'ID Back',
      'اختر الوقت ': 'Select Time',
      'تقيمك': 'Your Rating ',
      'اكتب سؤال': 'Enter Question',
      ' سؤال نعم او لا': 'Yes/No Question',
      'سؤال متعدد الاختيارات': 'Multiple choice Question',
      'سؤال باجابة واحدة ': 'Single Question ',
      'سؤال باجابات متعددة ': 'Enter Multi Answer Question',
      'نعم': 'Yes',
      'لا': 'No',
      'مسلم': ' Muslim ',
      'مسيحي': 'Christian ',
      'ذكر': ' Male ',
      'أنثى': ' Female ',
      ' ارسال': '   Submit   ',
      // Add other translations as needed
    };
    return translations[label] || label;
  }














  // ========================================================================================================================================
  // ======================================================================================================================================
  exportForm() {
    // Load Bootstrap CSS if not already loaded
    if (!document.querySelector('link[href="assets/bootstrap/bootstrap.min.css"]')) {
      const bootstrapCSS = document.createElement('link');
      bootstrapCSS.rel = 'stylesheet';
      bootstrapCSS.href = 'assets/bootstrap/bootstrap.min.css';
      document.head.appendChild(bootstrapCSS);
    }

    // Load Bootstrap JS if not already loaded
    if (!document.querySelector('script[src="assets/bootstrap/bootstrap.bundle.min.js"]')) {
      const bootstrapJS = document.createElement('script');
      bootstrapJS.src = 'assets/bootstrap/bootstrap.bundle.min.js';
      bootstrapJS.defer = true;
      document.body.appendChild(bootstrapJS);
    }

    // Load SweetAlert2 if not already loaded
    if (!document.querySelector('script[src="assets/sweetalert2/sweetalert2.all.min.js"]')) {
      const sweetAlertScript = document.createElement('script');
      sweetAlertScript.src = 'assets/sweetalert2/sweetalert2.all.min.js';
      sweetAlertScript.defer = true;
      document.body.appendChild(sweetAlertScript);
    }

    const bootstrapStyles = `<link rel="stylesheet" href="assets/bootstrap/bootstrap.min.css">`;
    const sweetAlertScript = `<script src="assets/sweetalert2/sweetalert2.all.min.js" defer></script>`;
    const bootstrapJsScript = `<script src="assets/bootstrap/bootstrap.bundle.min.js"></script>`;

    const getUserPreferences = async () => {
      try {
        // Step 1: Ask if user wants to name the form
        const { value: wantsCustomName } = await Swal.fire({
          title: 'Form Name?',
          text: 'Do you want to give the form a custom name?',
          icon: 'question',
          input: 'radio',
          inputOptions: {
            yes: 'Yes',
            no: 'No',
          },
          confirmButtonText: 'Next',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
          inputValidator: (value) => {
            if (!value) {
              return 'Please choose Yes or No';
            }
            return null;
          },
        });

        if (wantsCustomName === undefined) return null;

        let formName = '';
        if (wantsCustomName === 'yes') {
          const { value: userEnteredName } = await Swal.fire({
            title: 'Enter Form Name',
            input: 'text',
            inputPlaceholder: 'Example: Employee Data Form',
            showCancelButton: true,
            cancelButtonText: 'Cancel',
            confirmButtonText: 'Save Name',
          });
          if (userEnteredName === undefined) return null;
          formName = userEnteredName.trim();
        }

        // Step 2: Ask about display size
        const { value: displaySize } = await Swal.fire({
          title: 'Display Options',
          text: 'Do you want the form to display full width or half width?',
          icon: 'question',
          input: 'radio',
          inputOptions: {
            full: 'Full Width',
            half: 'Half Width',
          },
          inputValidator: (value) => {
            if (!value) {
              return 'Please choose an option';
            }
            return null;
          },
          confirmButtonText: 'Next',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });

        if (displaySize === undefined) return null;

        // Step 3: Ask how many fields per row
        const { value: fieldsPerRow } = await Swal.fire({
          title: 'Fields Per Row',
          input: 'number',
          inputLabel: 'How many fields do you want to display in each row? (1-4)',
          inputPlaceholder: 'Example: 2',
          inputAttributes: {
            min: '1',
            max: '4'
          },
          inputValidator: (value) => {
            if (!value || isNaN(Number(value)) || Number(value) <= 0 || Number(value) > 4) {
              return 'Please enter a number between 1 and 4';
            }
            return null;
          },
          confirmButtonText: 'Next',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });

        if (fieldsPerRow === undefined) return null;

        // Step 4: Ask about fields that should be alone in a row
        const fieldNames = this.formFields.map(f => f.label).join(', ');
        const { value: soloFields } = await Swal.fire({
          title: 'Single Row Fields',
          input: 'text',
          inputLabel: `Available fields: ${fieldNames}. Enter field names that should appear alone in a row (comma separated)`,
          inputPlaceholder: 'Example: email, password',
          confirmButtonText: 'Next',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });

        if (soloFields === undefined) return null;

        // Step 5: Ask about font size
        const { value: fontSize } = await Swal.fire({
          title: 'Font Size',
          text: 'Choose your preferred font size',
          icon: 'question',
          input: 'radio',
          inputOptions: {
            large: 'Large',
            small: 'Small',
          },
          inputValidator: (value) => {
            if (!value) {
              return 'Please choose an option';
            }
            return null;
          },
          confirmButtonText: 'Next',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });

        if (fontSize === undefined) return null;

        // Step 6: Ask about form language
        const { value: isArabic } = await Swal.fire({
          title: 'Form Language',
          text: 'Choose the form language',
          icon: 'question',
          input: 'radio',
          inputOptions: {
            ar: 'Arabic',
            en: 'English',
          },
          inputValidator: (value) => {
            if (!value) {
              return 'Please choose an option';
            }
            return null;
          },
          confirmButtonText: 'Generate Form',
          showCancelButton: true,
          cancelButtonText: 'Cancel',
        });

        if (isArabic === undefined) return null;

        return {
          formName: formName as string,
          displaySize: displaySize as 'full' | 'half',
          fieldsPerRow: Number(fieldsPerRow) as number,
          soloFields: soloFields.split(',').map((f: string) => f.trim()).filter((f: string) => f) as string[],
          fontSize: fontSize as 'large' | 'small',
          isArabic: isArabic === 'ar',
        };
      } catch (error) {
        console.error('Error while gathering preferences:', error);
        return null;
      }
    };

    getUserPreferences().then(async (preferences) => {
      if (!preferences) {
        Swal.fire('Operation cancelled.', '', 'info');
        return;
      }

      // تحميل بيانات المحافظات والمدن مسبقاً
      const [governments, cities] = await Promise.all([
        fetch('assets/data/governments.json').then(res => res.json() as Promise<Government[]>),
        fetch('assets/data/cities.json').then(res => res.json() as Promise<City[]>)
      ]);

      const { formName, displaySize, fieldsPerRow, soloFields, fontSize, isArabic } = preferences;
      const containerWidth = displaySize === 'full' ? '90%' : 'min(800px, 90%)';
      const textSize = fontSize === 'large' ? '18px' : '16px';
      const direction = isArabic ? 'rtl' : 'ltr';
      const align = isArabic ? 'right' : 'left';
      const lang = isArabic ? 'ar' : 'en';
      const finalTitle = formName || this.translateFieldLabel('Registration Form', isArabic);

      let formHtml = `
      <!DOCTYPE html>
      <html lang="${lang}" dir="${direction}">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${finalTitle}</title>
          ${bootstrapStyles}
          ${sweetAlertScript}
          <style>
            :root {
              --primary-color: #4285f4;
              --error-color: #ea4335;
              --border-radius: 6px;
              --box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              --gap: 15px;
            }
            
            body {
              font-family: 'Segoe UI', system-ui, sans-serif;
              line-height: 1.5;
              color: #333;
              background-color: #f5f7fa;
              padding: 20px;
              margin: 0;
              min-height: 100vh;
            }
            
            // .form-container {
            //   width: ${containerWidth};
            //   margin: 0 auto;
            //   background: white;
            //   border-radius: var(--border-radius);
            //   box-shadow: var(--box-shadow);
            //   padding: 25px;
            //   direction: ${direction};
            // }
            
            // h2 {
            //   color: var(--primary-color);
            //   margin-bottom: 25px;
            //   text-align: center;
            //   font-size: ${fontSize === 'large' ? '28px' : '24px'};
            // }
            
            // .form-grid {
            //   display: grid;
            //   grid-template-columns: repeat(${fieldsPerRow}, 1fr);
            //   gap: var(--gap);
            //   margin-bottom: var(--gap);
            // }
            
            // .form-group {
            //   margin-bottom: 0;
            // }
            
            .solo-field {
              grid-column: 1 / -1;
            }
            
            label {
              display: block;
              margin-bottom: 8px;
              font-weight: 500;
              color: #555;
            }
            
            .form-control {
              width: 90%;
              padding: 2px;
              margin:1px;
              font-size: ${textSize};
              border: 1px solid #ddd;
              border-radius: var(--border-radius);
              transition: all 0.2s;
            }
            
            .form-control:focus {
              border-color: var(--primary-color);
              outline: none;
              box-shadow: 0 0 0 3px rgba(66, 133, 244, 0.2);
            }
            
            .btn-submit {
              background-color: var(--primary-color);
              color: white;
              border: none;
              padding: 12px 24px;
              font-size: ${textSize};
              border-radius: var(--border-radius);
              cursor: pointer;
              display: block;
              width: 100%;
              max-width: 200px;
              margin: 25px auto 0;
              transition: all 0.2s;
            }
            
            .btn-submit:hover {
              background-color: #3367d6;
              transform: translateY(-2px);
            }
            
            .invalid-feedback {
              color: var(--error-color);
              font-size: 14px;
              margin-top: 5px;
              display: none;
            }
            
            .is-invalid {
              border-color: var(--error-color) !important;
            }
            
            .is-invalid ~ .invalid-feedback {
              display: block;
            }
            
            /* Mobile optimizations */
            @media (max-width: 768px) {
              .form-grid {
                grid-template-columns: 1fr;
                gap: 15px;
              }
              
              .form-container {
                padding: 15px;
                width: 100%;
              }
              
              .btn-submit {
                max-width: 100%;
              }
            }
            
            /* Special fields */
            .form-special {
              grid-column: 1 / -1;
              margin: 10px 0;
            }
            
            /* Radio buttons */
            .radio-group {
              display: flex;
              flex-wrap: wrap;
              gap: 10px;
            }
            
            .radio-option {
              display: flex;
              align-items: center;
              gap: 8px;
            }
            
            /* Rating */
            .rating-container {
              display: flex;
              gap: 10px;
              margin: 10px 0;
            }
            
            .rating-heart {
              font-size: 24px;
              color: #ccc;
              cursor: pointer;
              transition: all 0.2s;
            }
            
            .rating-heart.selected {
              color: #ff4757;
            }

            /* Rating Styles */
.rating-container {
  margin: 15px 0;
  padding: 15px;
  border-radius: 8px;
  background-color: #f5f5f5;
}

.rating-label {
  display: block;
  margin-bottom: 10px;
  font-weight: 500;
  color: #3f51b5;
}

.rating-stars {
  display: flex;
  gap: 5px;
  margin: 10px 0;
}

.rating-stars mat-icon {
  font-size: 30px;
  color: #ffc107;
  cursor: pointer;
  transition: all 0.2s;
}

.rating-stars mat-icon.active-star {
  color: #ff9800;
}

.rating-hint {
  font-size: 12px;
  color: #666;
  margin-top: 5px;
}

/* Question Styles */
.question-container {
  margin: 15px 0;
}

.question-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #3f51b5;
}



 :root {
          --primary-color: #4285f4;
          --error-color: #ea4335;
          --border-radius: 6px;
          --box-shadow: 0 2px 8px rgba(0,0,0,0.1);
          --gap: 15px;
        }
        
        body {
          font-family: 'Segoe UI', system-ui, sans-serif;
          line-height: 1.5;
          color: #333;
          background-color: #f5f7fa;
          padding: 20px;
          margin: 0;
          min-height: 100vh;
        }
        
        .form-container {
          width: ${containerWidth};
          margin: 0 auto;
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          padding: 25px;
          direction: ${direction};
          overflow: hidden;
        }
        
        h2 {
          color: var(--primary-color);
          margin-bottom: 25px;
          text-align: center;
          font-size: ${fontSize === 'large' ? '28px' : '24px'};
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: repeat(${fieldsPerRow}, minmax(150px, 1fr));
          gap: var(--gap);
          margin-bottom: var(--gap);
          overflow-x: auto;
          padding-bottom: 10px;
        }
        
        .form-group {
          margin-bottom: 0;
          min-width: 150px;
        }


        .file-upload-container {
  margin-bottom: 20px;
}

.file-upload-label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #333;
}

.file-upload-wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.file-upload-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 10px 15px;
  background-color: #f5f5f5;
  border: 1px dashed #ccc;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s;
  
  &:hover {
    background-color: #e0e0e0;
    border-color: #999;
  }
  
  mat-icon {
    color: #666;
  }
}

.file-preview {
  position: relative;
  width: 150px;
  height: 100px;
  border: 1px solid #eee;
  border-radius: 4px;
  overflow: hidden;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .remove-button {
    position: absolute;
    top: 5px;
    right: 5px;
    background-color: rgba(255, 255, 255, 0.8);
    
    mat-icon {
      font-size: 18px;
      color: #f44336;
    }
  }
}

.file-info {
  display: flex;
  flex-direction: column;
  font-size: 12px;
  color: #666;
  
  span:first-child {
    font-weight: 500;
    margin-bottom: 4px;
  }
}

          </style>
        </head>
        <body>
          <div class="form-container">
            <h2>${finalTitle}</h2>
            <form id="exportedForm">
              <div class="form-grid">
      `;

      let validationScripts = ``;

      // Sort fields: solo fields first
      const sortedFields = [...this.formFields].sort((a, b) => {
        const aIsSolo = soloFields.includes(a.label);
        const bIsSolo = soloFields.includes(b.label);
        return aIsSolo === bIsSolo ? 0 : aIsSolo ? -1 : 1;
      });

      // Generate fields
      for (const field of sortedFields) {
        const fieldId = field.id || field.label.replace(/\s+/g, '_');
        const isRequired = field.isRequired ? 'required' : '';
        const labelText = this.translateFieldLabel(field.label, isArabic);
        const placeholderText = field.placeholder ? this.translateFieldLabel(field.placeholder, isArabic) : this.getPlaceholder(field.label, isArabic);
        const isSolo = soloFields.includes(field.label);
        const fieldClass = isSolo ? 'form-special' : 'form-group';

        // Generate field HTML based on type
        let fieldHtml = '';
        switch (field.type) {
          case 'textarea':
            fieldHtml = `
              <div class="${fieldClass}">
                <label for="${fieldId}">${labelText}</label>
                <textarea class="form-control" id="${fieldId}" name="${fieldId}" 
                  placeholder="${placeholderText}" ${isRequired}></textarea>
                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;
            break;

          case 'radio':
            const options = field.options || [];
            const translatedOptions = options.map(opt => this.translateOption(opt, isArabic));

            fieldHtml = `
              <div class="${fieldClass}">
                <label>${labelText}</label>
                <div class="radio-group">
                  ${translatedOptions.map((opt, i) => `
                    <div class="radio-option">
                      <input type="radio" id="${fieldId}-${i}" name="${fieldId}" value="${opt}" ${isRequired}>
                      <label for="${fieldId}-${i}">${opt}</label>
                    </div>
                  `).join('')}
                </div>
                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;
            break;

          case 'Rate':
            const ratingLabel = isArabic ? 'تقييمك للخدمة' : 'Service Rating';
            const ratingHint = isArabic ? 'اضغط على القلوب لتقييم الخدمة' : 'Click hearts to rate the service';
            fieldHtml = `
              <div class="${fieldClass}">
                <div class="rating-container">

                  <span class="rating-label">${ratingLabel}</span>

                  <div class="rating-stars">
                    ${[1, 2, 3, 4, 5].map(i => `
                      <span class="rating-heart" data-value="${i}">♡</span>
                    `).join('')}
                  </div>
                  <span class="rating-hint">${ratingHint}</span>
                  <input type="hidden" id="${fieldId}" name="${fieldId}" ${isRequired}>
                  </div>
                      
               <textarea  formControlName="{{ field.id }}"  row=80 col=40 ></textarea>

                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;
            break;

          case 'file':
          case 'File Upload':
            fieldHtml = `
              <div class="${fieldClass}">
                <label for="${fieldId}" class="file-upload-label">${labelText}</label>
                <input type="file" class="form-control" 
                       id="${fieldId}" name="${fieldId}" ${isRequired}>
                <div class="file-preview" id="${fieldId}-preview">
                  <img id="${fieldId}-preview-image" src="#" alt="Preview">
                  <button type="button" class="remove-button" onclick="document.getElementById('${fieldId}-preview').style.display='none';document.getElementById('${fieldId}').value='';">
                    <mat-icon>close</mat-icon>
                  </button>
                </div>
                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;
            break;

          case 'Governments':
            fieldHtml = `
              <div class="${fieldClass}">
                <label for="${fieldId}">${labelText}</label>
                <select class="form-control" id="${fieldId}" name="${fieldId}" ${isRequired}>
                  <option value="">${isArabic ? 'اختر المحافظة' : 'Select Governorate'}</option>
                  ${governments.map((gov: Government) => `
                    <option value="${gov.id}">${isArabic ? gov.governorate_name_ar : gov.governorate_name_en}</option>
                  `).join('')}
                </select>
                <label for="${fieldId}_city" style="margin-top: 10px;">${isArabic ? 'المدينة' : 'City'}</label>
                <select class="form-control" id="${fieldId}_city" name="${fieldId}_city" ${isRequired}>
                  <option value="">${isArabic ? 'اختر المدينة' : 'Select City'}</option>
                </select>
                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;

            validationScripts += `
              // Cities data
              const citiesData = ${JSON.stringify(cities)};
              
              // Update cities when governorate changes
              document.getElementById('${fieldId}').addEventListener('change', function() {
                const govId = this.value;
                const citySelect = document.getElementById('${fieldId}_city');
                citySelect.innerHTML = '<option value="">${isArabic ? 'اختر المدينة' : 'Select City'}</option>';
                
                if (govId) {
                  const filteredCities = citiesData.filter(city => city.governorate_id === govId);
                  filteredCities.forEach(city => {
                    const option = document.createElement('option');
                    option.value = city.id;
                    option.textContent = ${isArabic} ? city.city_name_ar : city.city_name_en;
                    citySelect.appendChild(option);
                  });
                }
              });
            `;
            break;

          

          default:
            fieldHtml = `
              <div class="${fieldClass}">
                <label for="${fieldId}">${labelText}</label>
                <input type="${field.type === 'Date' ? 'date' : field.type === 'time' ? 'time' : 'text'}" 
                       class="form-control" 
                       id="${fieldId}" 
                       name="${fieldId}" 
                       placeholder="${placeholderText}"
                       ${isRequired}>
                <div class="invalid-feedback" id="${fieldId}-error"></div>
              </div>
            `;
        }

        formHtml += fieldHtml;

        // Add validation
        if (field.isRequired) {
          validationScripts += `
            // Validation for ${fieldId}
            const ${fieldId}Input = document.getElementById('${fieldId}');
            const ${fieldId}Error = document.getElementById('${fieldId}-error');
            if (!${fieldId}Input.value) {
              ${fieldId}Input.classList.add('is-invalid');
              ${fieldId}Error.textContent = '${isArabic ? 'هذا الحقل مطلوب' : 'This field is required'}';
              isValid = false;
              errorMessages.push('${labelText}: ${isArabic ? 'هذا الحقل مطلوب' : 'This field is required'}');
            } else {
              ${fieldId}Input.classList.remove('is-invalid');
              ${fieldId}Error.textContent = '';
            }
          `;
        }
      }

      // Close form grid and add submit button
      formHtml += `
              </div>
              <button type="submit" class="btn-submit">${isArabic ? 'حفظ' : 'Save'}</button>
            </form>
      `;

      // Add validation script
      formHtml += `
        <script>
          document.addEventListener('DOMContentLoaded', function() {
            // Initialize rating system
            document.querySelectorAll('.rating-heart').forEach(heart => {
              heart.addEventListener('click', function() {
                const value = this.getAttribute('data-value');
                document.querySelectorAll('.rating-heart').forEach((h, i) => {
                  h.textContent = i < value ? '❤️' : '♡';
                  h.classList.toggle('selected', i < value);
                });
                document.getElementById('rating').value = value;
              });
            });

            // Initialize file upload previews
            document.querySelectorAll('input[type="file"]').forEach(input => {
              input.addEventListener('change', function(e) {
                const file = e.target.files[0];
                const preview = document.getElementById(this.id + '-preview');
                const previewImage = document.getElementById(this.id + '-preview-image');
                
                if (file) {
                  const reader = new FileReader();
                  reader.onload = function(e) {
                    previewImage.src = e.target.result;
                    preview.style.display = 'block';
                  }
                  reader.readAsDataURL(file);
                }
              });
            });

            ${validationScripts}

            // Form validation
            document.getElementById('exportedForm').addEventListener('submit', function(e) {
              e.preventDefault();
              let isValid = true;
              let errorMessages = [];
              
              // Validate required fields
              ${this.formFields.filter(f => f.isRequired).map(field => {
        const fieldId = field.id || field.label.replace(/\s+/g, '_');
        return `
                  const ${fieldId}Input = document.getElementById('${fieldId}');
                  const ${fieldId}Error = document.getElementById('${fieldId}-error');
                  if (!${fieldId}Input.value) {
                    ${fieldId}Input.classList.add('is-invalid');
                    ${fieldId}Error.textContent = '${isArabic ? 'هذا الحقل مطلوب' : 'This field is required'}';
                    isValid = false;
                    errorMessages.push('${this.translateFieldLabel(field.label, isArabic)}: ${isArabic ? 'هذا الحقل مطلوب' : 'This field is required'}');
                  } else {
                    ${fieldId}Input.classList.remove('is-invalid');
                    ${fieldId}Error.textContent = '';
                  }
                `;
      }).join('\n')}
              
              if (isValid) {
                const formData = {};
                ${this.formFields.map(field => {
        const fieldId = field.id || field.label.replace(/\s+/g, '_');
        return `formData['${fieldId}'] = document.getElementById('${fieldId}').value;`;
      }).join('\n')}
                
                localStorage.setItem('formData', JSON.stringify(formData));
                Swal.fire({
                  icon: 'success',
                  title: '${isArabic ? 'تم الحفظ بنجاح' : 'Saved successfully'}'
                });
              } else {
                Swal.fire({
                  icon: 'error',
                  title: '${isArabic ? 'خطأ في الإدخال' : 'Input error'}',
                  html: errorMessages.join('<br>')
                });
              }
            });
          });
        </script>
        ${bootstrapJsScript}
          </div>
        </body>
      </html>
      `;

      // Export the file
      const blob = new Blob([formHtml], { type: 'text/html' });
      const a = document.createElement('a');
      const fileName = formName ? formName.replace(/\s+/g, '_') : 'form';
      a.href = URL.createObjectURL(blob);
      a.download = `${fileName}.html`;
      a.click();

      // Save to localStorage
      const saved = localStorage.getItem('savedForms');
      const savedForms = saved ? JSON.parse(saved) : [];
      savedForms.push({
        fileName: fileName + '.html',
        htmlContent: formHtml,
        createdDate: new Date().toISOString(),
      });
      localStorage.setItem('savedForms', JSON.stringify(savedForms));
    });
  }

  // Helper function to get placeholder text
  getPlaceholder(fieldName: string, isArabic: boolean): string {
    const placeholders: { [key: string]: { ar: string, en: string } } = {
      'Full Name': { ar: 'أدخل الاسم بالكامل', en: 'Enter full name' },
      'National ID': { ar: 'أدخل الرقم القومي', en: 'Enter national ID' },
      'Mobile Number': { ar: 'أدخل رقم الموبايل', en: 'Enter mobile number' },
      'Email': { ar: 'أدخل البريد الإلكتروني', en: 'Enter email address' },
      'Date': { ar: 'اختر التاريخ', en: 'Select date' },
      'Governorate': { ar: 'اختر المحافظة', en: 'Select governorate' },
      'City': { ar: 'اختر المدينة', en: 'Select city' },
      'Rating': { ar: 'قيم الخدمة', en: 'Rate the service' }
    };

    return placeholders[fieldName] ? (isArabic ? placeholders[fieldName].ar : placeholders[fieldName].en) : '';
  }

  // Helper function to translate field labels
  translateFieldLabel(label: string, isArabic: boolean): string {
    const translations: { [key: string]: { ar: string, en: string } } = {
      'FullName': { ar: 'الاسم بالكامل', en: 'Full Name' },
      'nationalId': { ar: 'الرقم القومي', en: 'National ID' },
      'Phone': { ar: 'رقم الموبايل ', en: 'Phone Number' },
      'Email': { ar: 'البريد الإلكتروني', en: 'Email' },
      'Enter Your Email': { ar :'البريد الالكترونى' , en :' Enter Your Email ..'},
      'Enter Text':{ar:'ادخل نص' , en :'Enter Text'},
    'الاسم بالكامل':{ar:'الاسم بالكامل ', en: 'Enter Full Name'},
    'Upload ID':{ar:'تحميل صورة الهوية الشخصية' , en :'Upload ID'},
    'البريد الالكترونى':{ar:'ادخل البريد الالكترونى', en:'Enter Email'},
      'Full Name':{ar:'ادخل الاسم بالكامل' , en : ' Enter Full Name '},
      'national id':{ar:'ادخل الرقم القومى ' ,en :'Enter National ID'},
      'Mobile Number': { ar: 'رقم الموبايل', en: 'Mobile Number' },
      'Phone Number':{ar:'ادخل رقم الموبايل', en :'Enter Phone Number '},
      'Date': { ar: 'التاريخ', en: 'Date' },
      'Single Question':{ar:' ادخل سؤالك ' , en: 'Enter Single Question '},
      'Governorate': { ar: 'المحافظة', en: 'Governorate' },
      'Governments':{ar:'المحافظة' , en : 'Governments'},
      'City': { ar: 'المدينة', en: 'City' },
      'Religion': { ar: 'الديانة', en: 'Religion' },
      'Gender': { ar: 'الجنس', en: 'Gender' },
      'Text': { ar: 'نص', en: 'Text' },
      'Header': { ar: 'عنوان', en: 'Header' },
      'Paragraph': { ar: 'فقرة', en: 'Paragraph' },
      'File Upload': { ar: 'رفع ملف', en: 'File Upload' },
      'ID': { ar: ' صورة البطاقة', en: 'ID ' },
      'ID Front': { ar: 'صورة البطاقة الامامية', en: 'ID Front' },
      'ID Back': { ar: 'صورة البطاقة الخلفية', en: 'ID Back' },
      'Time': { ar: 'الوقت', en: 'Time' },
      'Rating': { ar: 'التقييم', en: 'Rating' },
      'Multi Q':{ar:'سؤال اختيار متعدد' , en:'Multi Choose Question'},
      'Question': { ar: 'سؤال', en: 'Question' },
      'Yes/No': { ar: 'سؤال نعم/لا', en: 'Yes/No Question' },
      'Multiple Choice': { ar: 'اختيار متعدد', en: ' Multiple Choice' },
      'Single Q': { ar: ' ادخل سؤالك ', en: ' Single Question '} ,
      'Multi Answer': { ar: 'سؤال بإجابات متعددة ', en: ' Multi Question Answer' },
      'Submit': { ar: 'إرسال', en: 'Submit' },
      'This field is required': { ar: 'هذا الحقل مطلوب', en: 'This field is required' },
      'Registration Form': { ar: 'نموذج التسجيل', en: 'Registration Form' },
      'Saved successfully': { ar: 'تم الحفظ بنجاح', en: 'Saved successfully' },
      'Input error': { ar: 'خطأ في الإدخال', en: 'Input error' },
      'Marital Status': { ar: 'الحالة الاجتماعية', en: 'Marital Status' },
      'Enter Paragraph':{ar:'اكتب الفقرة .....' , en:'Enter Paragraph'},
      'Enter Header':{ar:'ادخل عنوان' , en: 'Enter Header'},

      
    };

    return translations[label] ? (isArabic ? translations[label].ar : translations[label].en) : label;
  }

  // Helper function to translate options
  translateOption(option: string, isArabic: boolean): string {
    const translations: { [key: string]: { ar: string, en: string } } = {
      'Male': { ar: 'ذكر', en: 'Male' },
      'Female': { ar: 'أنثى', en: 'Female' },
      'Single': { ar: 'أعزب', en: 'Single' },
      'Married': { ar: 'متزوج', en: 'Married' },
      'Divorced': { ar: 'مطلق', en: 'Divorced' },
      'Widowed': { ar: 'أرمل', en: 'Widowed' },
      'Yes': { ar: 'نعم', en: 'Yes' },
      'No': { ar: 'لا', en: 'No' },
      'Good': { ar: 'جيد', en: 'Good' },
      'Very Good': { ar: 'جيد جداً', en: 'Very Good' },
      'Excellent': { ar: 'ممتاز', en: 'Excellent' },
      'Muslim': { ar: 'مسلم', en: 'Muslim' },
      'Christian': { ar: 'مسيحي', en: 'Christian' }
    };

    return translations[option] ? (isArabic ? translations[option].ar : translations[option].en) : option;
  }
}
import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, FormGroupName, FormsModule, NgControl, NgControlStatus, NgModel, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService, User } from '../../services/user.service';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';
import { AppComponent } from '../../app.component';
import { UserDataService } from '../../services/user-data.service'; // <-- جديد
import { AuthInterceptor } from '../../services/token-interceptor';
import { DOCUMENT } from '@angular/common';



@Component({
selector: 'app-login',
standalone: true,
imports: [CommonModule, HttpClientModule,FormsModule,ReactiveFormsModule],

providers:[
],
templateUrl: './login.component.html',
styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
loginForm: FormGroup <any>;
loading = false;
error = '';
showPassword = false;


// Inject required services
constructor(
@Inject(PLATFORM_ID) private platformId: Object,

private formBuilder: FormBuilder,
private userDataService: UserDataService,
private authService: AuthService,
private userService: UserService,
private router: Router,
private http: HttpClient
) {
this.loginForm = this.formBuilder.group({
username: ['', Validators.required],
password: ['', Validators.required],
deviceID:[''],
});

}




// Helper getter for easy form control access
get f() {
  return this.loginForm.controls;
  }

// Toggle password visibility in the template
toggleShowPassword(): void {
this.showPassword = !this.showPassword;
}


  onSubmit(): void {
    if (this.loginForm.valid) {

      console.log(this.loginForm.value);

    }





this.loading = true;
const { username, password } = this.loginForm.value;
const deviceID = ''
let formData=new FormData;
formData.append("username",username );
formData.append("password",password );
// this.userService.getUserByUsernameAndPassword(username, password ).subscribe(res=>{
//   console.log(res , " resr")
// })
this.userService.getUserByUsernameAndPassword(username, password).subscribe({
  next: (response: any) => {
    console.log('Login response:', response); // تحقق من الاستجابة
    this.loading = false;
      // Store user (or token) after successful login
      // localStorage.setItem('currentUser', JSON.stringify(response.user));


       // بعد نجاح تسجيل الدخول ضعي بيانات المستخدم في السيرفس
    this.userDataService.setUserData({
      username,
      password,
      token: response.token // إذا جاء من السيرفر
    });
    localStorage.setItem('token', response.token);




     console.log(response.status)
      Swal.fire({
        icon: 'success',
        title: 'أهلاً بك!',
        // text: `مرحبًا ${response.user.username}!`,
        confirmButtonText: 'حسنًا'
      }).then(() => {
        // Redirect to home or any other route
        this.router.navigate(['otp']);
      });
    },
    error: (err) => {
      this.loading = false;
      this.error =
        'اسم المستخدم أو كلمة المرور غير صحيحة. الرجاء إعادة المحاولة.';
    }
  });




  }}


import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { NavigationEnd, RouterModule, Router, Event } from '@angular/router';
import { UserService } from '../../services/user.service';
import { ThemeService } from '../../services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HomeComponent } from '../home/home.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterModule,HttpClientModule,MatIconModule,NgIf,CommonModule],
  providers:[UserService],
  templateUrl:'./navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})

export class NavbarComponent implements OnInit {
  activeTab = 'home';

  isMenuOpen = false;

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    public themeService: ThemeService,
    private router: Router,
    private http: HttpClient,
    public userService: UserService
  ) {
    // Close menu when route changes
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isMenuOpen = false;
      }
    });
  }

  // Toggle menu
  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Close menu
  closeMenu() {
    this.isMenuOpen = false;
  }

  ngOnInit(): void {
    this.router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.activeTab = this.getActiveTab(url);
      }
    });
  }

  getActiveTab(url: string): string {
    if (url.includes('activities')) {
      return 'activities';
    } else if (url.includes('statistics')) {
      return 'statistics';
    } else if (url.includes('calendar')) {
      return 'calendar';
    } else if (url.includes('settings')) {
      return 'settings';
    } else if (url.includes('card')) {
      return 'card';
    } else {
      return 'home';
    }
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }


  logout() {
    Swal.fire({
      title: 'هل أنت متأكد أنك تريد تسجيل الخروج؟',
      text: 'ستحتاج إلى تسجيل الدخول مرة أخرى للوصول إلى حسابك.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'نعم، سجل خروج!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        // المستخدم أكد، متابعة تسجيل الخروج
        this.userService.logout();
        this.router.navigate(['/login']);
        Swal.fire({
          title: 'تم تسجيل الخروج',
          text: 'تم تسجيل خروجك بنجاح.',
          icon: 'success',
          confirmButtonText: 'حسنًا'
        });
      }
      // يمكنك معالجة الحالة الأخرى إذا لزم الأمر (مثلاً، عدم القيام بأي شيء عند الإلغاء)
    });
  }
  }







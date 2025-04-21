import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';



interface MenuItem {
  route: string;
  title: string;
  icon: string;
}


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [RouterModule,NgIf],
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss'
})
export class SettingsComponent {
  public sidebarShow: boolean = false;




  menuItems: MenuItem[] = [
    { route: '/users', title: 'المستخدمين', icon: 'fas fa-users' },
    { route: '/groups', title: 'المجموعات', icon: 'fas fa-users-cog' },
    { route: '/group-user', title: 'مجموعة المستخدم', icon: 'fas fa-user-friends' },
    { route: '/controls', title: 'الضوابط', icon: 'fas fa-sliders-h' },
    { route: '/group-control', title: 'ضوابط المجموعة', icon: 'fas fa-tasks' },
    { route: '/app-settings', title: 'إعدادات التطبيق', icon: 'fas fa-cogs' }
  ];

  toggleSidebar() {
    this.sidebarShow = !this.sidebarShow;
  }

  handleItemClick() {
    // Optional: Close sidebar on item click for mobile
    if (window.innerWidth <= 768) {
      this.sidebarShow = false;
    }
  }
}



import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-page-data',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './page-data.component.html',
  styleUrl: './page-data.component.scss'
})
export class PageDataComponent {

}

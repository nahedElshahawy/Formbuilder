import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-public-page-data',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './public-page-data.component.html',
  styleUrl: './public-page-data.component.scss'
})
export class PublicPageDataComponent {

}

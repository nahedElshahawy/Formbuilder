import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-extras',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './extras.component.html',
  styleUrl: './extras.component.scss'
})
export class ExtrasComponent {

}

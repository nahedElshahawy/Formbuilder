import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-all-activities',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './all-activities.component.html',
  styleUrl: './all-activities.component.scss'
})
export class AllActivitiesComponent {

}

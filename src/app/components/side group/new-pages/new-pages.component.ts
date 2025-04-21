import { Component } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';

@Component({
  selector: 'app-new-pages',
  standalone: true,
  imports: [SidebarComponent],
  templateUrl: './new-pages.component.html',
  styleUrl: './new-pages.component.scss'
})
export class NewPagesComponent {
  selectedForm: string = '';

  onFormSelected(form: string) {
    this.selectedForm = form;  // تحديث النموذج المختار
  }
}

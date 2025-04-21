import { Component, EventEmitter, Inject, OnInit, Output, PLATFORM_ID } from '@angular/core';
import { SidebarComponent } from '../../sidebar/sidebar.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { BasicsComponent } from '../basics/basics.component';
import { isPlatformBrowser, NgFor, NgForOf ,NgIf} from '@angular/common';

@Component({
  selector: 'app-my-pages',
  standalone: true,
  imports: [SidebarComponent, HttpClientModule, RouterModule, BasicsComponent, NgFor, NgForOf, NgIf],
  providers: [HttpClientModule],
  templateUrl: './my-pages.component.html',
  styleUrls: ['./my-pages.component.scss']
})
export class MyPagesComponent implements OnInit {

  // Stored forms loaded from localStorage
  savedForms: any[] = [];

  // Keeps track of the currently selected form index
  selectedFormIndex: number | null = null;

  constructor(
    private router: Router,
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: any
  ) {}

  ngOnInit(): void {
    // Only load if in the browser to avoid SSR errors
    if (isPlatformBrowser(this.platformId)) {
      this.loadSavedForms();
    }
  }

  // Load the saved forms from localStorage
  loadSavedForms(): void {
    const savedData = localStorage.getItem('savedForms');
    this.savedForms = savedData ? JSON.parse(savedData) : [];
  }

  // Download a form’s HTML content as a file
  downloadForm(index: number): void {
    const formItem = this.savedForms[index];
    if (!formItem || !formItem.htmlContent) {
      alert('No form data found.');
      return;
    }
    // Convert HTML to a Blob for downloading
    const blob = new Blob([formItem.htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);

    // Create temp <a> and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = formItem.fileName || 'exported_form.html';
    a.click();  // This was commented out, now it will trigger the download
    URL.revokeObjectURL(url);  // Clean up URL after usage
  }

  // View the form in a new tab
  viewForm(index: number): void {
    const formItem = this.savedForms[index];
    if (!formItem || !formItem.htmlContent) return;

    const newWindow = window.open('', '_blank');
    if (newWindow) {
      newWindow.document.write(formItem.htmlContent);
      newWindow.document.close();
    }
  }

  // Select a form to display its details in the main content area
  selectForm(index: number): void {
    this.selectedFormIndex = index;
  }

  // Delete a form from savedForms and localStorage
  deleteForm(index: number): void {
    if (confirm('Are you sure you want to delete this form?')) {
      this.savedForms.splice(index, 1);
      localStorage.setItem('savedForms', JSON.stringify(this.savedForms));
    }
  }

  // Edit a form - This could be implemented as opening a form in an editor (you can extend this functionality)
  editForm(index: number): void {
    const formItem = this.savedForms[index];
    if (formItem) {
      // You can redirect to a form editing page, or open the form in a form editor
      this.router.navigate(['/edit-form', formItem.id]);
    }
  }
}

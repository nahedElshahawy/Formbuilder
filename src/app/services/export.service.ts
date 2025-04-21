import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExportService {
  exportForm() {
    const htmlContent = document.querySelector('.preview-container')?.innerHTML;
    const styleContent = document.head.innerHTML;
    const blob = new Blob([`<html><head>${styleContent}</head><body>${htmlContent}</body></html>`], { type: 'text/html' });

    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'exported_form.html';
    a.click();
  }
}

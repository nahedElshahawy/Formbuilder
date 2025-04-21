import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkTheme: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {
    if (isPlatformBrowser(this.platformId)) {
      const savedTheme = localStorage.getItem('darkTheme');
      if (savedTheme !== null) {
        this.darkTheme = savedTheme === 'true';
      } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');
        this.darkTheme = prefersDark.matches;
      }

      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (localStorage.getItem('darkTheme') === null) {
          this.darkTheme = e.matches;
          this.updateTheme();
        }
      });

      this.updateTheme();
    } else {
      this.darkTheme = false;
    }
  }

  isDarkTheme(): boolean {
    return this.darkTheme;
  }

  toggleTheme(): void {
    this.darkTheme = !this.darkTheme;
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('darkTheme', this.darkTheme.toString());
      this.updateTheme();
    }
  }

  private updateTheme(): void {
    if (isPlatformBrowser(this.platformId)) {
      if (this.darkTheme) {
        document.body.classList.add('dark-theme');
      } else {
        document.body.classList.remove('dark-theme');
      }
    }
  }
}
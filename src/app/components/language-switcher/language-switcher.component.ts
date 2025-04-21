import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-switcher',
  template: `
    <button (click)="switchLanguage()" class="language-switcher">
      {{ currentLang === 'en' ? 'العربية' : 'English' }}
    </button>
  `,
  standalone: true,
})
export class LanguageSwitcherComponent {
  currentLang: string;

  constructor(private translate: TranslateService) {
    this.currentLang = localStorage.getItem('lang') || 'en';
    this.translate.use(this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';

    this.translate.onLangChange.subscribe((event) => {
      this.currentLang = event.lang;
      document.documentElement.dir = event.lang === 'ar' ? 'rtl' : 'ltr';
    });
  }

  switchLanguage() {
    this.currentLang = this.currentLang === 'en' ? 'ar' : 'en';
    this.translate.use(this.currentLang);
    localStorage.setItem('lang', this.currentLang);
    document.documentElement.dir = this.currentLang === 'ar' ? 'rtl' : 'ltr';
  }
}
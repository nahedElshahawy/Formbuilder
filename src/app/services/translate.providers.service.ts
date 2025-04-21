// translate.providers.ts
import { APP_INITIALIZER } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService, TranslateStore } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { Observable } from 'rxjs';

export function HttpLoaderFactory(http: HttpClient): TranslateLoader {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export function appInitializerFactory(translate: TranslateService) {
  return () => {
    const lang = localStorage.getItem('lang') || 'en';
    translate.addLangs(['en', 'ar']);
    translate.setDefaultLang('en');
    return translate.use(lang).toPromise();
  };
}

export function provideTranslations() {
  return [
    TranslateStore,
    {
      provide: TranslateLoader,
      useFactory: HttpLoaderFactory,
      deps: [HttpClient],
    },
    TranslateService,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializerFactory,
      deps: [TranslateService],
      multi: true,
    },
  ];
}
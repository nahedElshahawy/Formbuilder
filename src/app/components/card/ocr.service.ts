import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject, Observable } from 'rxjs';
import type { Worker, createWorker } from 'tesseract.js';
import { HttpClient ,HttpClientModule} from '@angular/common/http';

export interface OcrResult {
  fullName: string;
  nationalId: string;
  address: string;
  dateOfBirth: string;
  gender: string;
  profession: string;
  maritalStatus: string;
  religion: string;
}

interface TesseractWorker {
  loadLanguage: (lang: string) => Promise<void>;
  initialize: (lang: string) => Promise<void>;
  recognize: (image: string) => Promise<any>;
  terminate: () => Promise<void>;
}

@Injectable({
  providedIn: 'root',
})
export class OcrService {
  private worker: TesseractWorker | null = null;
  private progressSubject = new BehaviorSubject<number>(0);
  private statusSubject = new BehaviorSubject<string>('');
  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object,private http:HttpClient) {
    this.isBrowser = isPlatformBrowser(platformId);
    if (this.isBrowser) {
      this.initializeWorker();
    }
  }

  private async initializeWorker(): Promise<void> {
    if (!this.isBrowser) return;

    try {
      // Динамический импорт Tesseract.js
      const Tesseract = await import('tesseract.js');

      // Создание worker с правильной типизацией
      const worker = await (Tesseract.createWorker as any)({
        logger: (m: { status: string; progress: number }) => {
          if (m.status === 'recognizing text') {
            this.progressSubject.next(Math.round(m.progress * 100));
          }
          this.statusSubject.next(m.status);
        }
      });

      await worker.loadLanguage('ara+eng');
      await worker.initialize('ara+eng');

      this.worker = worker;
    } catch (error) {
      console.error('Error initializing OCR worker:', error);
      throw new Error('Failed to initialize OCR worker');
    }
  }

  getProgress(): Observable<number> {
    return this.progressSubject.asObservable();
  }

  getStatus(): Observable<string> {
    return this.statusSubject.asObservable();
  }

  async extractText(imageData: string): Promise<OcrResult> {
    if (!this.isBrowser) {
      return this.getEmptyResult();
    }

    if (!this.worker) {
      await this.initializeWorker();
    }

    try {
      if (!this.worker) {
        throw new Error('Worker not initialized');
      }

      const result = await this.worker.recognize(imageData);
      return this.parseOcrResult(result.data.text);
    } catch (error) {
      console.error('OCR extraction error:', error);
      throw new Error('Failed to extract text from image');
    }
  }

  private getEmptyResult(): OcrResult {
    return {
      fullName: '',
      nationalId: '',
      address: '',
      dateOfBirth: '',
      gender: '',
      profession: '',
      maritalStatus: '',
      religion: ''
    };
  }

  private parseOcrResult(text: string): OcrResult {
    const result = this.getEmptyResult();

    try {
      const lines = text.split('\n').map(line => line.trim());
      const patterns = {
        nationalId: /\d{14}/,
        fullName: /(الاسم|Name)\s*[:]\s*(.+)/i,
        dateOfBirth: /(تاريخ الميلاد|Date of Birth)\s*[:]\s*(\d{1,2}[-/]\d{1,2}[-/]\d{4})/i,
        gender: /(النوع|الجنس|Gender)\s*[:]\s*(ذكر|أنثى|Male|Female)/i,
        address: /(العنوان|Address)\s*[:]\s*(.+)/i,
        profession: /(المهنة|Profession)\s*[:]\s*(.+)/i,
        maritalStatus: /(الحالة الاجتماعية|Marital Status)\s*[:]\s*(.+)/i,
        religion: /(الديانة|Religion)\s*[:]\s*(.+)/i
      };

      for (const line of lines) {
        Object.entries(patterns).forEach(([key, pattern]) => {
          const match = line.match(pattern);
          if (match) {
            if (key === 'nationalId') {
              result[key] = match[0];
            } else {
              result[key as keyof OcrResult] = this.cleanText(match[2]);
            }
          }
        });
      }

      return result;
    } catch (error) {
      console.error('Error parsing OCR result:', error);
      return result;
    }
  }

  private cleanText(text: string): string {
    return text
      .replace(/\s+/g, ' ')
      .replace(/[^\u0621-\u064A0-9a-zA-Z\s]/g, ' ')
      .trim();
  }

  async destroy(): Promise<void> {
    if (this.isBrowser && this.worker) {
      try {
        await this.worker.terminate();
        this.worker = null;
      } catch (error) {
        console.error('Error terminating OCR worker:', error);
      }
    }
  }
}

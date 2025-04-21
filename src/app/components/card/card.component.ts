import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Component, OnDestroy, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { OcrService, OcrResult } from './ocr.service';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { OcrApiService } from '../../services/ocr-api.service';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';


interface CardData {
  frontImage: string | ArrayBuffer | null;
  backImage: string | ArrayBuffer | null;
  frontName: string;
  backName: string;
  extractedData: OcrResult;
}

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CommonModule,HttpClientModule,ReactiveFormsModule,FormsModule,RouterModule],
  providers:[HttpClientModule],
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss']
})
export class CardComponent implements OnInit, OnDestroy {
  frontImage: string | ArrayBuffer | null = null;
  backImage: string | ArrayBuffer | null = null;
  frontName: string = '';
  backName: string = '';
  extractedData: any = null;
  ocrProgress: number = 0;
  ocrStatus: string = '';
  cards: any[] = [];
  currentEditingIndex: number | null = null;

  constructor(private ocrApiService: OcrApiService,private http:HttpClient,
    private ocrservice:OcrService,private router:Router) {}
  ngOnDestroy(): void {
    throw new Error('Method not implemented.');
  }
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  onFileSelected(event: Event, type: 'front' | 'back') {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (type === 'front') {
          this.frontImage = reader.result;
          this.frontName = file.name;
          this.processOcr(reader.result as string);
        } else {
          this.backImage = reader.result;
          this.backName = file.name;
        }
      };
      reader.readAsDataURL(file);
    }
  }

  processOcr(imageData: any) {
    this.ocrApiService.extractTextFromImage(imageData).subscribe(
      response => {
        this.extractedData = response.text;
        console.log('Extracted Data:', this.extractedData);
      },
      error => {
        console.error('Error extracting text:', error);
      }
    );
  }

  saveData() {
    if (this.frontImage && this.backImage) {
      const cardData = {
        frontImage: this.frontImage,
        backImage: this.backImage,
        frontName: this.frontName,
        backName: this.backName,
        extractedData: this.extractedData
      };

      if (this.currentEditingIndex !== null) {
        this.cards[this.currentEditingIndex] = cardData;
        this.currentEditingIndex = null;
      } else {
        this.cards.push(cardData);
      }
      this.resetForm();
    }
  }

  resetForm() {
    this.frontImage = null;
    this.backImage = null;
    this.frontName = '';
    this.backName = '';
    this.extractedData = null;
    this.currentEditingIndex = null;
  }

  viewDetails(index: number) {
    const card = this.cards[index];
    // عرض التفاصيل باستخدام SweetAlert أو أي طريقة أخرى
  }

  editCard(index: number) {
    const card = this.cards[index];
    this.frontImage = card.frontImage;
    this.backImage = card.backImage;
    this.frontName = card.frontName;
    this.backName = card.backName;
    this.extractedData = card.extractedData;
    this.currentEditingIndex = index;
  }

  deleteCard(index: number) {
    this.cards.splice(index, 1);
  }
}
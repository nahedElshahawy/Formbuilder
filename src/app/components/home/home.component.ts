import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule, NgModel, ReactiveFormsModule } from '@angular/forms';
import { isPlatformBrowser, NgFor } from '@angular/common';
import { PLATFORM_ID, Inject } from '@angular/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { BrowserModule } from '@angular/platform-browser';
import Swal from 'sweetalert2/dist/sweetalert2.js';


@Component({
selector: 'app-home',
standalone: true,
providers:[HttpClientModule],
imports:[
  NgFor,
FormsModule,ReactiveFormsModule,SidebarComponent,HttpClientModule
],
templateUrl:'./home.component.html',
styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

// خاص بالملاحظات
notes: string[] = [];
newNoteContent: string = '';

constructor(@Inject(PLATFORM_ID) private platformId: Object, private http:HttpClient) {}


ngOnInit(): void {
  // إذا رغبت بتحميل الملاحظات من localStorage:
  const storedNotes = localStorage.getItem('notes');
  if (storedNotes) {
  this.notes = JSON.parse(storedNotes);
  }
  }


// إافة ملاحظة لمصفوفة الملاحظات
addNote() {
if (this.newNoteContent.trim()) {
this.notes.push(this.newNoteContent.trim());
this.newNoteContent = '';
// في حال أردتِ حفظها في localStorage:
localStorage.setItem('notes', JSON.stringify(this.notes));
}
}

// حذف ملاحظة
deleteNote(index: number) {
this.notes.splice(index, 1);
// حفظ بعد الحذف إن كنتِ تستخدمين localStorage
if (isPlatformBrowser(this.platformId)) {
  localStorage.setItem('notes', JSON.stringify(this.notes));
  }}
  }

import { Component, ChangeDetectorRef, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { RouterModule, RouterOutlet } from '@angular/router';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarOptions, DateSelectArg } from '@fullcalendar/core';
import interactionPlugin from '@fullcalendar/interaction';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import { createEventId } from './event-utils';
import arLocale from '@fullcalendar/core/locales/ar';
import { EventService } from '../side group/create-activity/event.service';
import Swal from 'sweetalert2';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FullCalendarModule, RouterModule,HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss']
})
export class CalendarComponent implements OnInit {
  calendarOptions!: CalendarOptions;


  public getItem(key: string): string | null {
    if (isPlatformBrowser(this.platformId)) {
    return localStorage.getItem(key);
    }
    return null;
    }

  public setItem(key: string, value: string) {
    if (isPlatformBrowser(this.platformId)) {
    localStorage.setItem(key, value);
    }
    }

  constructor(private changeDetector: ChangeDetectorRef,
     private eventService: EventService,
    @Inject(PLATFORM_ID) private platformId: any
     ) { }

  ngOnInit(): void {
    this.calendarOptions = {
      plugins: [interactionPlugin, dayGridPlugin, timeGridPlugin, listPlugin],
      initialView: 'dayGridMonth',
      locales: [arLocale],
      locale: 'ar',
      headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
      },
      events: this.eventService.getEvents(),
      selectable: true,
      selectMirror: true,
      select: this.handleDateSelect.bind(this),
      eventContent: this.renderEventContent.bind(this),
      eventClick: this.handleEventClick.bind(this),
      expandRows: true,
      firstDay: 6,
      displayEventTime: false,
      dayMaxEventRows: true,
      // أزيلي أو غيّري eventOverlap حتى نسمح بتعدد الأحداث في نفس اليوم
      // eventOverlap: false, // احذفي هذه أو اجعليها true أو علّقيها
      
      
      height: 'auto',
      eventDisplay: 'block'
      };
    // الاشتراك في التغييرات في الأحداث
    this.eventService.events$.subscribe(events => {

      if (isPlatformBrowser(this.platformId)) {

      this.calendarOptions.events = events;
      this.changeDetector.detectChanges();
   } })
  
  }

  handleDateSelect(selectInfo: DateSelectArg) {
    const calendarApi = selectInfo.view.calendar;
    calendarApi.unselect(); // إلغاء التحديد

    Swal.fire({
      title: 'إضافة حدث جديد',
      html:
        '<input id="event-title" class="swal2-input" placeholder="عنوان الحدث">' +
        '<input type="color" id="event-color" class="swal2-input" style="width: 100px;">' +
        '<input type="file" id="event-image" class="swal2-file" accept="image/*" style="display: block; margin-top: 10px;">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'حفظ',
      cancelButtonText: 'إلغاء',
      preConfirm: () => {
        const title = (Swal.getPopup()?.querySelector('#event-title') as HTMLInputElement).value;
        const color = (Swal.getPopup()?.querySelector('#event-color') as HTMLInputElement).value || '#3788d8';
        const imageFile = (Swal.getPopup()?.querySelector('#event-image') as HTMLInputElement).files?.[0];

        if (!title) {
          Swal.showValidationMessage('يجب عليك إدخال عنوان الحدث!');
        }

        // التحقق من حجم الصورة
        if (imageFile && imageFile.size > 1048576) { // 1 ميجابايت = 1048576 بايت
          Swal.showValidationMessage('حجم الصورة يجب أن لا يزيد عن 1 ميجابايت!');
        }

        return { title, color, imageFile };
      }
    }).then((result) => {
      if (result.isConfirmed && result.value?.title) {
        const { title, color, imageFile } = result.value;

        if (imageFile) {
          const reader = new FileReader();
          reader.onload = (e) => {
            const imageSrc = e.target?.result as string;

            // تغيير حجم الصورة إلى 60x60 بكسل
            const img = new Image();
            img.onload = () => {
              const canvas = document.createElement('canvas');
              canvas.width = 60;
              canvas.height = 60;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(img, 0, 0, 60, 60);
                const resizedImageDataUrl = canvas.toDataURL('image/png');

                this.addEvents(selectInfo, title, color, resizedImageDataUrl);
              }
            };
            img.src = imageSrc;
          };
          reader.readAsDataURL(imageFile);
        } else {
          this.addEvents(selectInfo, title, color, null);
        }
      }
    });
  }

  addEvents(selectInfo: DateSelectArg, title: string, color: string, imageDataUrl: string | null) {
    const startDate = new Date(selectInfo.startStr);
    const endDate = new Date(selectInfo.endStr);
    const dates = [];

    let currentDate = new Date(startDate);
    while (currentDate < endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    dates.forEach((date) => {
      const dateStr = date.toISOString().split('T')[0];
      const newEvent = {
        id: createEventId(),
        title: title ,
        start: dateStr,
        end: dateStr,
        allDay: true,
        backgroundColor: color,
        borderColor: color,
        extendedProps: {
          imageUrl: imageDataUrl
        }
      };

      // إضافة الحدث إلى الخدمة
      this.eventService.addEvent(newEvent);
    });

    // إظهار رسالة تأكيد
    Swal.fire({
      icon: 'success',
      title: 'تم الإضافة',
      text: 'تم إضافة الحدث بنجاح.',
      confirmButtonText: 'حسنًا'
    });
  }


  
  renderEventContent(eventInfo: any) {


    const imageUrl = eventInfo.event.extendedProps.imageUrl;
    const title = eventInfo.event.title;
    const backgroundColor = eventInfo.event.backgroundColor || '#3788d8';


    
    let htmlContent = `<div class="event-content">`;
    
    // إضافة مربع اللون
    htmlContent += `<div class="color-box" style="background-color:${backgroundColor};"></div>`;
    
    if (imageUrl) {
    htmlContent +=  `<div class="event-image-container"> <img src="${imageUrl}" alt="صورة الحدث" class="event-image" /> </div>` ;
    }
    
    htmlContent +=` <div class="event-title">${title}</div>`;
    htmlContent += `</div>`;
    
    return { html: htmlContent };
    }

  handleEventClick(clickInfo: any) {
    Swal.fire({
      title: 'هل أنت متأكد من الحذف؟',
      text: `هل تريد حذف الحدث '${clickInfo.event.title}'؟`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'نعم، احذفه!',
      cancelButtonText: 'إلغاء'
    }).then((result) => {
      if (result.isConfirmed) {
        this.eventService.deleteEvent(clickInfo.event.id);

        Swal.fire({
          icon: 'success',
          title: 'تم الحذف',
          text: 'تم حذف الحدث بنجاح.',
          confirmButtonText: 'حسنًا'
        });
      }
    });
  }
}

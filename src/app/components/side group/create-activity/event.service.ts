// event.service.ts

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { EventInput } from '@fullcalendar/core';

@Injectable({
  providedIn: 'root',
})
export class EventService {
  private eventsSubject = new BehaviorSubject<EventInput[]>([]);
  events$ = this.eventsSubject.asObservable();

  private events: EventInput[] = [];

  constructor() { }

  getEvents() {
    return this.events;
  }

  addEvent(event: EventInput) {
    // إنشاء مصفوفة جديدة مع الحدث الجديد
    this.events = [...this.events, event];
    this.eventsSubject.next(this.events);
  }

  deleteEvent(eventId: string) {
    // إنشاء مصفوفة جديدة بعد إزالة الحدث المطلوب حذفه
    this.events = this.events.filter(event => event.id !== eventId);
    this.eventsSubject.next(this.events);
  }

  // إضافة أحداث متعددة
  addEvents(events: EventInput[]) {
    this.events = [...this.events, ...events];
    this.eventsSubject.next(this.events);
  }
}

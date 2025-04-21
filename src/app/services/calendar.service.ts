import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CalendarService {
  private activities: any[] = [];

  addActivity(activity: any): void {
    this.activities.push(activity);
  }

  getActivities(): any[] {
    return this.activities;
  }
}

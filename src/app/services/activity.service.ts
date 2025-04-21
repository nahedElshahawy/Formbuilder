import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private activitySource = new BehaviorSubject<any>(null);
  currentActivity = this.activitySource.asObservable();

  updateActivity(activity: any) {
    this.activitySource.next(activity);
  }
}

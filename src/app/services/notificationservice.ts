import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { NotificationModel } from '../models/notifications/notificationmodel';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceNotifications {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/notification'; // Uses the API URL from environment

  getNotifications(limit: number = 20, offset: number = 0): Observable<NotificationModel[]> {
    return this.http.get<NotificationModel[]>(`${this.apiUrl}/GetNotifications`, {
      params: { limit, offset },
    });
  }

  getUnreadNotificationCount(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/GetUnreadNotificationCount`);
  }

  markNotificationRead(notificationid: number): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/MarkNotificationRead`, null, {
      params: { notificationid },
    });
  }

  markAllNotificationsRead(): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/MarkAllNotificationsRead`, null);
  }
}

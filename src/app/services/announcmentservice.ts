// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { getannouncements } from '../models/announcement/getannouncments';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceAnnouncment {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/announcement'; // Uses the API URL from environment

  getAnnouncements(): Observable<getannouncements[]> {
    return this.http.get<getannouncements[]>(this.apiUrl + '/getAnnouncements');
  }

  expireAnnouncement(announcementid: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/expireAnnouncement;`, {
      announcementid,
    });
  }

  submitAddAnnouncement(
    announcementid: number = 0,
    title: string,
    announcement: string,
    dateexpire: Date,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertAnnouncement`, {
      announcementid,
      title,
      announcement,
      dateexpire,
    });
  }

  submitUpdateAnnouncement(
    announcementid: number,
    title: string,
    announcement: string,
    dateexpire: Date | null,
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateAnnouncement`, {
      announcementid,
      title,
      announcement,
      dateexpire,
    });
  }
}

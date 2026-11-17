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

  submitAddAnnouncement(
    announcementid: number = 0,
    title: string,
    accouncement: string,
    dateexpire: Date,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/insertAnnouncement`, {
      announcementid,
      title,
      accouncement,
      dateexpire,
    });
  }

  submitUpdateAnnouncement(
    announcementid: number,
    title: string,
    accouncement: string,
    dateexpire: Date,
  ): Observable<any> {
    return this.http.post(`${this.apiUrl}/unsertAnnouncement`, {
      announcementid,
      title,
      accouncement,
      dateexpire,
    });
  }
}

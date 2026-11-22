// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetReported } from '../models/reported/getreported';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceReported {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/reported'; // Uses the API URL from environment

  getReported(reportedStatusId: number, startDate: string, endDate: string): Observable<any> {
    // definitions of models is not needed in this architecture
    const getReportedStatuses$ = this.http.get(this.apiUrl + `/getReportedStatuses`);
    const getReportedMember$ = this.http.get(this.apiUrl + `/getReportedAdmin`, {
      params: { reportedStatusId, startDate, endDate },
    });

    return forkJoin({
      getReportedStatuses: getReportedStatuses$,
      getReportedMember: getReportedMember$,
    });
  }

  submitReported(report: GetReported): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/InsertReported`, report);
  }

  /*

  submitUpdateReported(
    announcementid: number,
    title: string,
    announcement: string,
    dateexpire: Date | null,
  ): Observable<any> {
    return this.http.put(`${this.apiUrl}/updateReported`, {
      announcementid,
      title,
      announcement,
      dateexpire,
    });
  }
    */
}

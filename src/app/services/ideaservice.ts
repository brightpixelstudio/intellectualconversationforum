import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetIdea } from '../models/ideas/getidea';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceIdeas {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/idea'; // Uses the API URL from environment

  getIdeas(
    ideaStatusId: number,
    ideaTypeId: number,
    startDate: string,
    endDate: string,
  ): Observable<any> {
    // definitions of models is not needed in this architecture
    const getIdeaStatuses$ = this.http.get(this.apiUrl + `/getIdeaStatuses`);
    const getIdeaTypes$ = this.http.get(this.apiUrl + `/getIdeaTypes`);
    const getIdeas$ = this.http.get(this.apiUrl + `/getIdeas`, {
      params: { ideaStatusId, ideaTypeId, startDate, endDate },
    });

    return forkJoin({
      getIdeaStatuses: getIdeaStatuses$,
      getIdeaTypes: getIdeaTypes$,
      getIdeas: getIdeas$,
    });
  }

  /*
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
    */
}

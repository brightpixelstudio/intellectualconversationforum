import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';
import { GetIdea } from '../models/ideas/getidea';
import { FormIdeaUpdate } from '../models/ideas/formideaupdate';

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
    const getIdeaStatuses$ = this.http.get(this.apiUrl + `/getIdeaStatuses`);
    const getIdeaTypes$ = this.http.get(this.apiUrl + `/getIdeaTypes`);
    const getIdeas$ = this.http.post(this.apiUrl + `/getIdeas`, {
      startDate,
      endDate,
      ideaTypeId,
      ideaStatusId,
    });

    return forkJoin({
      getIdeaStatuses: getIdeaStatuses$,
      getIdeaTypes: getIdeaTypes$,
      getIdeas: getIdeas$,
    });
  }

  insertIdea(
    userGuid: string,
    ideaTypeId: number,
    title: string,
    description: string,
  ): Observable<any> {
    return this.http.post(this.apiUrl + `/insertIdea`, {
      userGuid,
      ideaTypeId,
      title,
      description,
    });
  }

  updateIdea(model: FormIdeaUpdate): Observable<any> {
    return this.http.put<any>(this.apiUrl + `/updateIdea`, model);
  }
}

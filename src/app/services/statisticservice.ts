// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceStatistics {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/statistic'; // Uses the API URL from environment

  // GET request to fetch data
  getStatistics(): Observable<any> {
    // NOTE - you dont need models for this architecture
    const getMostPopularCatagories$ = this.http.get(this.apiUrl + `/GetMostPopularCatagories`);
    const getMostPostsMembers$ = this.http.get(this.apiUrl + `/GetMostPostsMembers`);
    const getMostPopularPostWithComments$ = this.http.get(
      this.apiUrl + `/GetMostPopularPostWithComments`,
    );
    return forkJoin({
      getMostPopularCatagories: getMostPopularCatagories$,
      getMostPostsMembers: getMostPostsMembers$,
      getMostPopularPostWithComments: getMostPopularPostWithComments$,
    });
  }
}

// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetCatagoryList } from '../models/utilities/getcatagorylist';
import { GetVerifyZipcode } from '../models/utilities//getverifyzipcode';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceUtility {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/utility'; // Uses the API URL from environment

  // GET request to fetch data
  getCatagoryList(): Observable<GetCatagoryList[]> {
    return this.http.get<GetCatagoryList[]>(this.apiUrl + '/GetCatagoryList');
  }

  // GET request to fetch data
  getVerifyZipcode(zipcode: string): Observable<GetVerifyZipcode[]> {
    const params = new HttpParams().set('zipcode', zipcode?.toString() || '');
    return this.http.get<GetVerifyZipcode[]>(this.apiUrl + '/GetVerifyZipcode', { params });
  }
}

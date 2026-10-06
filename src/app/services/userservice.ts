// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetAllProfileMembers } from '../models/getallprofilemembers';
import { GetNewestMembers } from '../models/getnewestmembers';
import { GetMostPostsMembers } from '../models/getmostpostsmembers';
import { GetLatestLoginsMembers } from '../models/getlatestloginsmembers';
import { GetProfileMember } from '../models/member/getprofilemember';
import { GetUserList } from '../models/member/getuserlist';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceUser {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/user'; // Uses the API URL from environment

  // GET request to fetch data
  getAllProfileMembers(): Observable<GetAllProfileMembers[]> {
    return this.http.get<GetAllProfileMembers[]>(this.apiUrl + '/GetAllProfileMembers');
  }

  // GET request to fetch data
  getNewestMembers(): Observable<GetNewestMembers[]> {
    return this.http.get<GetNewestMembers[]>(this.apiUrl + '/GetNewestMembers');
  }

  // GET request to fetch data
  getMostPostsMembers(): Observable<GetMostPostsMembers[]> {
    return this.http.get<GetMostPostsMembers[]>(this.apiUrl + '/GetMostPostsMembers');
  }

  // GET request to fetch data
  getLatestLoginsMembers(): Observable<GetLatestLoginsMembers[]> {
    return this.http.get<GetLatestLoginsMembers[]>(this.apiUrl + '/getLatestLoginsMembers');
  }

  // GET request to fetch data
  getUserProfile(userid: number): Observable<GetProfileMember[]> {
    return this.http.get<GetProfileMember[]>(this.apiUrl + `/getProfileMember?userid=${userid}`);
  }

  // GET request to fetch data
  getUserList(): Observable<GetUserList[]> {
    return this.http.get<GetUserList[]>(this.apiUrl + '/getUserList');
  }

  getUserStatistics(useridparam: number | undefined): Observable<any> {
    // NOTE - you dont need models for this architecture
    const getPostsMember$ = this.http.get(this.apiUrl + `/getPostsMember?userid=${useridparam}`);
    const getCommentsMember$ = this.http.get(
      this.apiUrl + `/getCommentsMember?userid=${useridparam}`,
    );
    const getPostsWithMostCommentsMember$ = this.http.get(
      this.apiUrl + `/getPostsWithMostCommentsMember?userid=${useridparam}`,
    );
    return forkJoin({
      getPostsMember: getPostsMember$,
      getCommentsMember: getCommentsMember$,
      // getPostsWithMostCommentsMember: getPostsWithMostCommentsMember$,
    });
  }

  // Accept the raw data value as an argument
  submitRegistrationForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/addNewMember', formData);
  }

  submitUpdateProfileForm(userid: number, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updateMemberProfile?userid=${userid}`, formData);
  }

  deleteUser(userid: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeleteMember?userid=${userid}`);
  }
}

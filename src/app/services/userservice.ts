// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetAllProfileMembers } from '../models/getallprofilemembers';
import { GetNewestMembers } from '../models/getnewestmembers';
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
  getLatestLoginsMembers(): Observable<GetLatestLoginsMembers[]> {
    return this.http.get<GetLatestLoginsMembers[]>(this.apiUrl + '/getLatestLoginsMembers');
  }

  // GET request to fetch data
  getUserProfile(userguid: string): Observable<GetProfileMember> {
    return this.http.get<GetProfileMember>(this.apiUrl + `/getProfileMember?userguid=${userguid}`);
  }

  // GET request to fetch data
  getUserList(): Observable<GetUserList[]> {
    return this.http.get<GetUserList[]>(this.apiUrl + '/getUserList');
  }

  getUserProfileStatistics(userguid: string | undefined): Observable<any> {
    // definitions of models is not needed in this architecture
    const getUserProfile$ = this.http.get<GetProfileMember>(
      this.apiUrl + `/getProfileMember?userguid=${userguid}`,
    );
    const getPostsMember$ = this.http.get(this.apiUrl + `/getPostsMember?userguid=${userguid}`);
    const getCommentsMember$ = this.http.get(
      this.apiUrl + `/getCommentsMember?userguid=${userguid}`,
    );
    const getUserPostRatings$ = this.http.get(
      this.apiUrl + `/getUserPostRatings?userguid=${userguid}`,
    );
    const getUserCommentRatings$ = this.http.get(
      this.apiUrl + `/getUserCommentRatings?userguid=${userguid}`,
    );
    return forkJoin({
      getUserProfile: getUserProfile$,
      getPostsMember: getPostsMember$,
      getCommentsMember: getCommentsMember$,
      getUserPostRatings: getUserPostRatings$,
      getUserCommentRatings: getUserCommentRatings$,
    });
  }

  getUserStatistics(userguid: string | undefined): Observable<any> {
    // NOTE - you dont need models for this architecture
    const getPostsMember$ = this.http.get(this.apiUrl + `/getPostsMember?userguid=${userguid}`);
    const getCommentsMember$ = this.http.get(
      this.apiUrl + `/getCommentsMember?userguid=${userguid}`,
    );
    const getPostsWithMostCommentsMember$ = this.http.get(
      this.apiUrl + `/getPostsWithMostCommentsMember?userguid=${userguid}`,
    );
    return forkJoin({
      getPostsMember: getPostsMember$,
      getCommentsMember: getCommentsMember$,
      getPostsWithMostCommentsMember: getPostsWithMostCommentsMember$,
    });
  }

  // Accept the raw data value as an argument
  submitRegistrationForm(formData: FormData): Observable<any> {
    return this.http.post(this.apiUrl + '/addNewMember', formData);
  }

  submitUpdateProfileForm(userguid: string, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updateMemberProfile?userguid=${userguid}`, formData);
  }

  deleteUser(userGuid: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeleteMember?userGuid=${userGuid}`);
  }

  submitPostUserRating(userguid: string, postguid: string, rating: number): Observable<any> {
    return this.http.post(
      this.apiUrl +
        `/insertPostUserRating?userguid=${userguid}&postguid=${postguid}&rating=${rating}`,
      null,
    );
  }

  submitCommentUserRating(userguid: string, commentguid: string, rating: number): Observable<any> {
    return this.http.post(
      this.apiUrl +
        `/insertCommentUserRating?userguid=${userguid}&commentguid=${commentguid}&rating=${rating}`,
      null,
    );
  }
}

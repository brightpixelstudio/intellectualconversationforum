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
import { GetAccountStatuses } from '../models/member/getaccountstatuses';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServiceUser {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/user'; // Uses the API URL from environment

  getAllProfileMembers(): Observable<GetAllProfileMembers[]> {
    return this.http.get<GetAllProfileMembers[]>(this.apiUrl + '/GetAllProfileMembers');
  }

  getNewestMembers(): Observable<GetNewestMembers[]> {
    return this.http.get<GetNewestMembers[]>(this.apiUrl + '/GetNewestMembers');
  }

  getLatestLoginsMembers(): Observable<GetLatestLoginsMembers[]> {
    return this.http.get<GetLatestLoginsMembers[]>(this.apiUrl + '/getLatestLoginsMembers');
  }

  getUserProfile(userguid: string): Observable<GetProfileMember> {
    return this.http.get<GetProfileMember>(this.apiUrl + `/getProfileMember?userguid=${userguid}`);
  }

  getUserList(): Observable<GetUserList[]> {
    return this.http.get<GetUserList[]>(this.apiUrl + '/getUserList');
  }

  getAccountStatuses(): Observable<GetAccountStatuses[]> {
    return this.http.get<GetAccountStatuses[]>(this.apiUrl + '/getAccountStatuses');
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
    const getPostRatingsMember$ = this.http.get(
      this.apiUrl + `/getPostRatingsMember?userguid=${userguid}`,
    );
    const getCommentRatingsMember$ = this.http.get(
      this.apiUrl + `/getCommentRatingsMember?userguid=${userguid}`,
    );
    return forkJoin({
      getUserProfile: getUserProfile$,
      getPostsMember: getPostsMember$,
      getCommentsMember: getCommentsMember$,
      getPostRatingsMember: getPostRatingsMember$,
      getCommentRatingsMember: getCommentRatingsMember$,
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

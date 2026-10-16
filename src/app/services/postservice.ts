// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { catchError, of } from 'rxjs';
import { HttpErrorResponse } from '@angular/common/http';
import { GetPostsByCategoryUserRating } from '../models/posts/getpostsbycategoryuserrating';
import { GetPost } from '../models/posts/getpost';
import { GetComment } from '../models/posts/getcomment';
import { GetPostComments } from '../models/posts/getpostcomments';
import { GetPostRatings } from '../models/posts/getpostratings';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root', // Makes the service a global singleton
})
export class ApiServicePost {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/post'; // Uses the API URL from environment

  // GET request to fetch data
  getPosts(
    catagoryidparam: number | null,
    userGuid: string | null,
    ratingparam: number | null,
    searchString: string | null,
  ): Observable<GetPostsByCategoryUserRating[]> {
    const catagoryParam =
      catagoryidparam == null || catagoryidparam == 0 ? '' : `postcatagoryId=${catagoryidparam}`;
    const ratingParam = ratingparam == null || ratingparam == 0 ? '' : `rating=${ratingparam}`;

    // build the string based on values.
    let params = new HttpParams();

    if (catagoryidparam != null && catagoryidparam !== 0) {
      params = params.append('postcatagoryId', catagoryidparam);
    }

    if (userGuid != null && userGuid.trim().length !== 0) {
      params = params.append('userGuid', userGuid.trim());
    }

    if (ratingparam != null && ratingparam !== 0) {
      params = params.append('rating', ratingparam);
    }
    if (searchString != null && searchString.trim().length !== 0) {
      params = params.append('searchString', searchString.trim());
    }

    return this.http.get<GetPostsByCategoryUserRating[]>(
      this.apiUrl + '/getPostsByCategoryUserRating',
      {
        params,
      },
    );
  }

  // GET request to fetch data
  getPost(postguid: string): Observable<GetPost[]> {
    return this.http.get<GetPost[]>(this.apiUrl + `/getPost?postguid=${postguid}`);
  }

  getComment(commentguid: string): Observable<GetComment[]> {
    return this.http.get<GetComment[]>(this.apiUrl + `/getComment?commentguid=${commentguid}`);
  }

  submitNewPostForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/addPost', formData);
  }

  submitNewCommentForm(postguid: string, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/addComment?postguid=${postguid}`, formData);
  }

  getComments(postGuid: string): Observable<GetPostComments[]> {
    return this.http
      .get<GetPostComments[]>(this.apiUrl + `/GetPostComments?postGuid=${postGuid}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([]);
          }

          throw error;
        }),
      );
  }

  getpostratings(postGuid: string): Observable<GetPostRatings[]> {
    return this.http
      .get<GetPostRatings[]>(this.apiUrl + `/GetPostRatings?postGuid=${postGuid}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 404) {
            return of([]);
          }

          throw error;
        }),
      );
  }

  deletePost(guid: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeletePost?guid=${guid}`);
  }

  deleteComment(guid: string): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeleteComment?guid=${guid}`);
  }

  submitUpdatePostForm(postguid: string, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updatePost?postguid=${postguid}`, formData);
  }

  submitUpdateCommentForm(commentguid: string, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updateComment?commentguid=${commentguid}`, formData);
  }
}

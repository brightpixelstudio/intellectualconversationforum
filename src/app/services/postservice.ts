// src/app/services/api.service.ts
import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { GetPostsByCategoryUserRating } from '../models/posts/getpostsbycategoryuserrating';
import { GetPost } from '../models/posts/getpost';
import { GetComment } from '../models/posts/getcomment';
import { GetPostComments } from '../models/posts/getpostcomments';
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
    useridparam: number | null,
    ratingparam: number | null,
  ): Observable<GetPostsByCategoryUserRating[]> {
    const catagoryParam =
      catagoryidparam == null || catagoryidparam == 0 ? '' : `postcatagoryId=${catagoryidparam}`;
    const userParam = useridparam == null || useridparam == 0 ? '' : `userId=${useridparam}`;
    const ratingParam = ratingparam == null || ratingparam == 0 ? '' : `rating=${ratingparam}`;

    // build the string based on values.
    let params = new HttpParams();

    if (catagoryidparam != null && catagoryidparam !== 0) {
      params = params.append('postcatagoryId', catagoryidparam);
    }

    if (useridparam != null && useridparam !== 0) {
      params = params.append('userId', useridparam);
    }

    if (ratingparam != null && ratingparam !== 0) {
      params = params.append('rating', ratingparam);
    }

    return this.http.get<GetPostsByCategoryUserRating[]>(
      this.apiUrl + '/getPostsByCategoryUserRating',
      {
        params,
      },
    );
  }

  // GET request to fetch data
  getPost(postid: number): Observable<GetPost[]> {
    return this.http.get<GetPost[]>(this.apiUrl + `/getPost?postid=${postid}`);
  }

  getComment(commentid: number): Observable<GetComment[]> {
    return this.http.get<GetComment[]>(this.apiUrl + `/getComment?commentid=${commentid}`);
  }

  submitNewPostForm(formData: any): Observable<any> {
    return this.http.post(this.apiUrl + '/addPost', formData);
  }

  submitNewCommentForm(postid: number, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/addComment?postid=${postid}`, formData);
  }

  getComments(postid: number): Observable<GetPostComments[]> {
    return this.http.get<GetPostComments[]>(this.apiUrl + `/GetPostComments?postid=${postid}`);
  }

  deletePost(postid: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeletePost?postid=${postid}`);
  }

  deleteComment(commentid: number): Observable<any> {
    return this.http.delete<any>(this.apiUrl + `/DeleteComment?postcommentid=${commentid}`);
  }

  submitUpdatePostForm(postid: number, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updatePost?postid=${postid}`, formData);
  }

  submitUpdateCommentForm(commentid: number, formData: any): Observable<any> {
    return this.http.post(this.apiUrl + `/updateComment?commentid=${commentid}`, formData);
  }
}

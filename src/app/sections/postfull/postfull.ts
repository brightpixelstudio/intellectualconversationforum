import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { AuthService } from '../../services/auth';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServicePost } from '../../services/postservice';
import { GlobalService } from '../../services/globalservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPost } from '../../models/posts/getpost';
import { PostImage } from '../../models/posts/postimage';
import { GetRatings } from '../../models/posts/getratings';
import { GetPostComments } from '../../models/posts/getpostcomments';
import { RatingCommentUserlist } from '../../models/posts/ratingcommentuserlist';
import { RatingComponent } from './../rating/rating';
import { DecimalPipe } from '@angular/common';
import { PostImagesComponent } from './../postimages/postimages/postimages';

@Component({
  selector: 'postfull',
  imports: [DatePipe, RatingComponent, DecimalPipe, PostImagesComponent],
  templateUrl: './postfull.html',
  styleUrl: './postfull.css',
})
export class PostFull implements OnInit {
  timePassed?: string;
  postguid: string = '';
  userguid: string = '';
  userList!: any[];

  showRatings = false;
  thePost: GetPost | null = null;
  postCommentId: string | null = null;
  theComments: GetPostComments[] = [];
  thePostRatings: GetRatings[] = [];

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServicePost: ApiServicePost,
    public authService: AuthService,
    public globalService: GlobalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // get the query string value
    const postguid = this.route.snapshot.queryParamMap.get('postguid');
    if (!postguid) return;
    this.postguid = postguid;
    this.userguid = this.authService.getUserGuid() ?? '';

    // Are we scrolling to a comment?
    this.postCommentId = this.route.snapshot.queryParamMap.get('postcommentid');

    // load the post / comments
    forkJoin({
      users: this.apiServiceUser.getUserList(),
      post: this.apiServicePost.getPost(this.postguid, this.userguid),
      comments: this.apiServicePost.getComments(this.postguid, this.userguid),
      ratings: this.apiServicePost.getpostratings(this.postguid),
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.thePost = response.post[0];
        this.theComments = response.comments;
        this.thePostRatings = response.ratings;
        this.timePassed = this.globalService.getTimePassed(this.thePost.dateadded);
        this.cdr.detectChanges();

        this.scrollToComment();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  // Post rating
  onPostRatingSelected(rating: number): void {
    if (!this.thePost) return;

    this.thePost.successrating = false;

    this.apiServiceUser.submitPostUserRating(this.userguid, this.postguid, rating).subscribe({
      next: (response) => {
        if (!this.thePost) return;

        this.thePost.rating = response.ratingAverage;
        this.thePost.ratingcount = response.ratingCount;
        this.thePost.userrating = rating;
        this.thePost.successrating = true;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to submit rating', error);
      },
    });
  }

  onCommentRatingSelected(rating: number, commentguid: string): void {
    // Turn off all comment success messages
    this.setCommentSuccessMessages(false);

    this.apiServiceUser.submitCommentUserRating(this.userguid, commentguid, rating).subscribe({
      next: (response) => {
        const comment = this.theComments.find((c) => c.commentguid === commentguid);

        if (comment) {
          comment.rating = response.averageRating;
          comment.ratingcount = response.ratingCount;
          comment.userrating = rating;
          comment.successrating = true;
        }

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to submit comment rating', error);
      },
    });
  }

  onDeleteCommentClick(postguid: string, commentguid: string) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    // delete the actual comment
    this.apiServicePost.deleteComment(commentguid).subscribe({
      next: (response) => {
        // Remove the deleted comment
        this.theComments = this.theComments.filter(
          (comment) => comment.commentguid !== commentguid,
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert('Unable to delete the comment.');
      },
    });
  }

  // helpers
  setCommentSuccessMessages(show: boolean) {
    this.theComments.forEach((comment) => {
      comment.successrating = show;
    });
  }

  setCommentRating(commentguid: string, rating: number, show: boolean): void {
    const comment = this.theComments.find((c) => c.commentguid === commentguid);

    if (comment) {
      comment.rating = rating;
      comment.successrating = show;
    }
  }

  toggleRatings(): void {
    this.showRatings = !this.showRatings;
  }

  scrollToComment(): void {
    if (!this.postCommentId) return;

    setTimeout(() => {
      const element = document.getElementById(`comment-${this.postCommentId}`);

      element?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }, 100);
  }
}

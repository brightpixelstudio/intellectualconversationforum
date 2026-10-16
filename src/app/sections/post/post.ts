import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServicePost } from '../../services/postservice';
import { GlobalService } from '../../services/globalservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPost } from '../../models/posts/getpost';
import { GetPostRatings } from '../../models/posts/getpostratings';
import { GetPostComments } from '../../models/posts/getpostcomments';
import { RatingCommentUserlist } from '../../models/posts/ratingcommentuserlist';

@Component({
  selector: 'post',
  imports: [DatePipe, JsonPipe],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post implements OnInit {
  timePassed?: string;
  postguid: string = '';
  userguid: string = '';
  rating: number = 0;
  userList!: any[];

  showRatings = false;
  showRatingSuccess = false;
  thePost: GetPost | null = null;
  theComments: GetPostComments[] = [];
  thePostRatings: GetPostRatings[] = [];
  ratingCommentUserList: RatingCommentUserlist[] = [];

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServicePost: ApiServicePost,
    public globalService: GlobalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // get the query string value
    const postguid = this.route.snapshot.queryParamMap.get('postguid');
    if (!postguid) return;
    this.postguid = postguid;

    // load the post / comments
    forkJoin({
      users: this.apiServiceUser.getUserList(),
      post: this.apiServicePost.getPost(this.postguid),
      comments: this.apiServicePost.getComments(this.postguid),
      ratings: this.apiServicePost.getpostratings(this.postguid),
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.thePost = response.post[0];
        this.theComments = response.comments;
        this.thePostRatings = response.ratings;
        this.rating = this.thePost.rating;
        this.userguid = this.userList[0].userguid;
        this.timePassed = this.globalService.getTimePassed(this.thePost.dateadded);
        // add all comment guid to list
        this.ratingCommentUserList = this.theComments.map((comment) => ({
          commentguid: comment.commentguid,
          userguid: '',
        }));
        console.log('ratings', this.thePostRatings);
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  // dropdown
  onUserPostChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.userguid = select.value;
  }

  onUserCommentChange(event: Event, commentguid: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const userguid = selectElement.value;

    // update the record
    const record = this.ratingCommentUserList.find((x) => x.commentguid === commentguid);

    if (record) {
      record.userguid = userguid;
    }
  }

  onPostRatingToolbarClick(event: MouseEvent, postguid: string): void {
    this.showRatingSuccess = false;
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    if (button) {
      // Pass variables to the service
      this.apiServiceUser
        .submitPostUserRating(this.userguid, postguid, +button.textContent?.trim())
        .subscribe({
          next: (response) => {
            this.rating = response.averageRating;
            this.showRatingSuccess = true;
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Failed to submit rating', error);
          },
        });
    }
  }

  onCommentRatingToolbarClick(event: MouseEvent, commentguid: string): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    // turn off all success messages
    this.setCommentSuccessMessages(false);

    // have they set a userid for this comment?
    const rating = this.ratingCommentUserList.find((x) => x.commentguid === commentguid);

    if (!rating || rating.userguid === '') {
      window.alert('Please select a user to rate this comment');
      return;
    }

    if (!button) return;

    // Pass variables to the service
    this.apiServiceUser
      .submitCommentUserRating(rating.userguid, commentguid, +button.textContent?.trim())
      .subscribe({
        next: (response) => {
          // Update the comment and rating
          this.setCommentRating(commentguid, response.averageRating, true);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to submit comment rating', error);
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
}

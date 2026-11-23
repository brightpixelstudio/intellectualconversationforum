import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServicePost } from './../../../app/services/postservice';
import { GetRatings } from '../../../app/models/posts/getratings';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { GetPost } from '../../models/posts/getpost';
import { GetPostComments } from '../../models/posts/getpostcomments';

@Component({
  selector: 'ratingsview',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './ratingsview.html',
  styleUrl: './ratingsview.css',
})
export class RatingsView {
  @Input({ required: true }) post!: GetPost;
  @Input() comment?: GetPostComments;

  showRatings = false;
  ratingsTitle = '';
  ratingsAverage = 0;
  ratingsCount = 0;
  loadingRatings = false;

  faUsers = faUsers;

  ratings: GetRatings[] = [];

  constructor(
    private apiServicePost: ApiServicePost,
    private cdr: ChangeDetectorRef,
  ) {}

  loadPostRatings(): void {
    if (this.comment) {
      this.ratingsTitle = 'Comment Ratings';
      this.ratingsAverage = this.comment.rating;
      this.ratingsCount = this.comment.ratingcount;
    } else {
      this.ratingsTitle = 'Post Ratings';
      this.ratingsAverage = this.post.rating;
      this.ratingsCount = this.post.ratingcount;
    }

    this.showRatings = true;
    this.loadingRatings = true;
    this.ratings = [];

    const ratings$ = this.comment
      ? this.apiServicePost.getcommentratings(this.comment.commentguid)
      : this.apiServicePost.getpostratings(this.post.postguid);

    ratings$.subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.loadingRatings = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingRatings = false;
        this.cdr.detectChanges();
        console.error('Error loading ratings:', err);
      },
    });
  }
}

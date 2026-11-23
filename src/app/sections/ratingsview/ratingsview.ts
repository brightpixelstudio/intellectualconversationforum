import { Component, Input, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServicePost } from './../../../app/services/postservice';
import { GetRatings } from '../../../app/models/posts/getratings';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
import { GetPost } from '../../models/posts/getpost';

@Component({
  selector: 'ratingsview',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './ratingsview.html',
  styleUrl: './ratingsview.css',
})
export class RatingsView {
  @Input({ required: true }) post!: GetPost;

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
    this.ratingsTitle = 'Post Ratings';
    this.ratingsAverage = this.post.rating;
    this.ratingsCount = this.post.ratingcount;

    this.showRatings = true;
    this.loadingRatings = true;
    this.ratings = [];

    this.apiServicePost.getpostratings(this.post.postguid).subscribe({
      next: (ratings) => {
        this.ratings = ratings;
        this.loadingRatings = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.loadingRatings = false;
        this.cdr.detectChanges();
        console.error('Error loading post ratings:', err);
      },
    });
  }
}

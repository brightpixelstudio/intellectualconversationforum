import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { UserType } from './../../../../enums/usertype';
import { faThumbtack } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { ApiServiceUser } from './../../../../services/userservice';
import { ApiServicePost } from './../../../../services/postservice';
import { GlobalService } from './../../../../services/globalservice';

import { GetPostsByCategoryUserRating } from './../../../../models/posts/getpostsbycategoryuserrating';
import { GetPostComments } from './../../../../models/posts/getpostcomments';
import { RatingComponent } from './../../../rating/rating';
import { PostImagesComponent } from './../../../postimages/postimages/postimages';

@Component({
  selector: 'post',
  imports: [DatePipe, JsonPipe, RatingComponent, PostImagesComponent, FontAwesomeModule],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {
  @Input({ required: true }) post!: GetPostsByCategoryUserRating;
  @Input() userList: any[] = [];
  @Input() userguidloggedin: string | null = null;
  @Input() usertypeidloggedin: number | null = null;

  @Output() postDeleted = new EventEmitter<string>();
  @Output() pinStatusChanged = new EventEmitter<void>();

  comments: GetPostComments[] = [];

  commentsExpanded = false;
  loadingComments = false;
  commentsLoaded = false;
  postExpanded = false;
  UserType = UserType;
  faThumbtack = faThumbtack;

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServicePost: ApiServicePost,
    public globalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  // Post text expansion
  togglePost(): void {
    this.postExpanded = !this.postExpanded;
  }

  isPostExpanded(): boolean {
    return this.postExpanded;
  }

  get isAdmin(): boolean {
    return this.usertypeidloggedin === UserType.Admin;
  }

  togglePinPost(): void {
    if (this.post.ispinned) {
      this.apiServicePost.unpinPost(this.post.postguid).subscribe({
        next: () => {
          this.post.ispinned = false;
          this.post.datepinned = null;
          this.post.pinnedbyuserid = null;
          this.pinStatusChanged.emit();
        },
        error: (err) => {
          console.error('Error unpinning post:', err);
        },
      });
    } else {
      this.apiServicePost.pinPost(this.post.postguid).subscribe({
        next: () => {
          this.post.ispinned = true;
          this.post.datepinned = new Date();
          this.pinStatusChanged.emit();
        },
        error: (err) => {
          console.error('Error pinning post:', err);
        },
      });
    }
  }
  getPostPreview(post: string, maxlength: number): string {
    if (!post) {
      return '';
    }

    const plainText = this.globalService.stripHtml(post);

    return plainText.length > this.globalService.getPostMaxLengthAbbreviated()
      ? plainText.substring(0, this.globalService.getPostMaxLengthAbbreviated()) + '...'
      : plainText;
  }

  hasMoreText(post: string | null | undefined): boolean {
    if (!post) {
      return false;
    }

    return (
      this.globalService.stripHtml(post).length > this.globalService.getPostMaxLengthAbbreviated()
    );
  }

  getTimePassed(date: Date) {
    return this.globalService.getTimePassed(date);
  }

  // Comments
  onViewCommentsClick(): void {
    if (this.commentsExpanded) {
      this.commentsExpanded = false;
      return;
    }

    this.commentsExpanded = true;

    if (this.commentsLoaded) {
      return;
    }

    this.loadingComments = true;

    this.apiServicePost.getComments(this.post.postguid, this.post.userguid).subscribe({
      next: (comments: GetPostComments[]) => {
        this.comments = comments;
        this.commentsLoaded = true;
        this.loadingComments = false;
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.loadingComments = false;
        this.cdr.markForCheck();
      },
    });
  }

  // Post rating
  onPostRatingSelected(rating: number): void {
    this.post.successrating = false;

    this.apiServiceUser
      .submitPostUserRating(this.userguidloggedin ?? '', this.post.postguid, rating)
      .subscribe({
        next: (response) => {
          this.post.rating = response.ratingAverage;
          this.post.ratingcount = response.ratingCount;
          this.post.userrating = rating;
          this.post.successrating = true;
          console.log(this.post.rating);

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to submit rating', error);
        },
      });
  }

  // Comment rating
  onCommentRatingSelected(rating: number, commentguid: string): void {
    // Turn off all comment success messages
    this.comments.forEach((comment) => {
      comment.successrating = false;
    });

    this.apiServiceUser
      .submitCommentUserRating(this.userguidloggedin ?? '', commentguid, rating)
      .subscribe({
        next: (response) => {
          const comment = this.comments.find((item) => item.commentguid === commentguid);

          if (comment) {
            comment.rating = response.averageRating;
            comment.ratingcount = response.ratingCount;
            comment.userrating = rating;
            comment.successrating = true;
          }

          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to submit comment rating', error);
        },
      });
  }

  // Delete post
  onDeletePostClick(): void {
    const confirmed = window.confirm('Are you sure you want to delete this post?');

    if (!confirmed) {
      return;
    }

    this.apiServicePost.deletePost(this.post.postguid).subscribe({
      next: () => {
        this.postDeleted.emit(this.post.postguid);
      },
      error: () => {
        window.alert('Error deleting this post');
      },
    });
  }

  // Delete comment
  onDeleteCommentClick(commentguid: string): void {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    this.apiServicePost.deleteComment(commentguid).subscribe({
      next: () => {
        this.comments = this.comments.filter((comment) => comment.commentguid !== commentguid);

        this.cdr.detectChanges();
      },
      error: () => {
        alert('Unable to delete the comment.');
      },
    });
  }
}

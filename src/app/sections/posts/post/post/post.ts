import { Component, Input, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';

import { ApiServiceUser } from './../../../../services/userservice';
import { ApiServicePost } from './../../../../services/postservice';
import { GlobalService } from './../../../../services/globalservice';

import { GetPostsByCategoryUserRating } from './../../../../models/posts/getpostsbycategoryuserrating';
import { GetPostComments } from './../../../../models/posts/getpostcomments';
import { RatingComponent } from './../../../rating/rating';

@Component({
  selector: 'post',
  imports: [DatePipe, RatingComponent],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class PostComponent {
  @Input({ required: true }) post!: GetPostsByCategoryUserRating;
  @Input() userList: any[] = [];
  @Input() userguidloggedin: string | null = null;

  @Output() postDeleted = new EventEmitter<string>();

  comments: GetPostComments[] = [];

  commentsExpanded = false;
  loadingComments = false;
  commentsLoaded = false;
  postExpanded = false;

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

    this.apiServicePost.getComments(this.post.postguid).subscribe({
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
          this.post.rating = response.averageRating;
          this.post.ratingcount = response.ratingCount;
          this.post.userrating = rating;
          this.post.successrating = true;

          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Failed to submit rating', error);
        },
      });
  }

  // Comment rating
  onCommentRatingToolbarClick(event: MouseEvent, commentguid: string): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    this.comments.forEach((comment) => {
      comment.successrating = false;
    });

    if (!button) {
      return;
    }

    this.apiServiceUser
      .submitCommentUserRating(
        this.userguidloggedin ?? '',
        commentguid,
        +button.textContent?.trim(),
      )
      .subscribe({
        next: (response) => {
          const comment = this.comments.find((item) => item.commentguid === commentguid);

          if (comment) {
            comment.rating = response.averageRating;
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

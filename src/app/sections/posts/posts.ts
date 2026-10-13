import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceUtility } from '../../services/utilityservice';
import { ApiServicePost } from '../../services/postservice';
import { GlobalService } from '../../services/globalservice';
import { GetPostsByCategoryUserRating } from '../../models/posts/getpostsbycategoryuserrating';
import { GetPostComments } from '../../models/posts/getpostcomments';
import { RatingPostUserList } from '../../models/posts/ratingpostuserlist';
import { RatingCommentUserlist } from '../../models/posts/ratingcommentuserlist';

@Component({
  selector: 'posts',
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  noPosts: boolean = false;
  postId: number = 0;
  userid: number | null = null;
  rating: number = 0;
  userratingid: number = 0;
  catagoryid: number | null = null;
  searchString: string = '';
  userList!: any[];
  catagoryList!: any[];
  postsList: GetPostsByCategoryUserRating[] = [];
  ratingPostUserList: RatingPostUserList[] = [];
  ratingCommentUserList: RatingCommentUserlist[] = [];

  // Comments stored separately for each post
  commentsByPostId = new Map<number, GetPostComments[]>();

  // Track which posts have their comments expanded
  expandedPostIds = new Set<number>();

  // Track which posts are currently loading
  loadingPostIds = new Set<number>();

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServicePost: ApiServicePost,
    public globalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    forkJoin({
      users: this.apiServiceUser.getUserList(),
      catagories: this.apiServiceUtilities.getCatagoryList(),
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.catagoryList = response.catagories;
        this.cdr.detectChanges();

        // any query strings sent in?
        const urlParams = new URLSearchParams(window.location.search);
        const catagory = urlParams.get('catagoryid');
        const user = urlParams.get('userid');

        if (catagory) {
          this.catagoryid = +catagory;
        }
        if (user) {
          this.userid = +user;
        }

        // load posts
        this.loadPosts();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  setratingPostUserList() {
    this.ratingPostUserList = [];
    this.ratingCommentUserList = [];
    for (const post of this.postsList) {
      this.ratingPostUserList.push({
        postid: post.postid,
        userid: 0,
      });
    }
  }

  setratingCommentUserList() {
    this.ratingCommentUserList = [];

    // Insert all comment IDs from every loaded post
    this.commentsByPostId.forEach((comments) => {
      comments.forEach((comment) => {
        this.ratingCommentUserList.push({
          commentid: comment.postcommentid,
          userid: 0,
        });
      });
    });
  }

  loadPosts() {
    // get posts
    this.apiServicePost
      .getPosts(this.catagoryid, this.userid, this.rating, this.searchString)
      .subscribe({
        next: (data: GetPostsByCategoryUserRating[]) => {
          this.postsList = data;
          this.noPosts = false;
          this.setratingPostUserList();
          // turn off all success messages
          this.setPostSuccessMessages(false);
          this.cdr.detectChanges();
        },
        error: (err) => {
          this.noPosts = true;
          this.cdr.detectChanges();
        },
      });
  }

  // Events
  // **************************
  // Main Filters
  onCatagoryChange(catagory: string) {
    this.catagoryid = +catagory;
  }

  onUserChange(user: string) {
    this.userid = +user;
  }

  onPostRatingChange(ratingIn: string) {
    // ensure there is some value and it is between 1 and 10
    const rating = ratingIn === '' ? 0 : Number(ratingIn);
    if (rating !== 0 && (rating < 1 || rating > 10)) {
      return;
    }
    this.rating = +ratingIn;
  }

  onSearchChange(value: string): void {
    this.searchString = value;
  }

  // **************************

  // dropdown
  onPostUserRatingChange(event: Event, postId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const userId = Number(selectElement.value);

    // update the record
    const record = this.ratingPostUserList.find((x) => x.postid === postId);

    if (record) {
      record.userid = userId;
    }
  }

  // dropdown
  onCommentUserRatingChange(event: Event, commentId: number): void {
    const selectElement = event.target as HTMLSelectElement;
    const userId = Number(selectElement.value);

    // update the record
    const record = this.ratingCommentUserList.find((x) => x.commentid === commentId);

    if (record) {
      record.userid = userId;
    }
  }

  onViewCommentsClick(postId: number): void {
    // If already expanded, collapse this post's comments
    if (this.expandedPostIds.has(postId)) {
      this.expandedPostIds.delete(postId);
      return;
    }

    // Expand this post independently
    this.expandedPostIds.add(postId);

    // Avoid loading the same comments again
    if (this.commentsByPostId.has(postId)) {
      return;
    }

    this.loadingPostIds.add(postId);

    this.apiServicePost.getComments(postId).subscribe({
      next: (comments: GetPostComments[]) => {
        this.commentsByPostId.set(postId, comments);
        this.setratingCommentUserList();
        this.loadingPostIds.delete(postId);

        // Notify Angular that the view needs updating
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.loadingPostIds.delete(postId);
      },
    });
  }

  onDeletePostClick(postId: number) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      this.apiServicePost.deletePost(postId).subscribe({
        next: (response) => {
          // remove the record from the lists
          this.removeItem(this.postsList, (post) => post.postid === postId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          window.alert('Error deleting this post');
        },
      });
    }
  }

  onPostRatingToolbarClick(event: MouseEvent, postId: number): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    // turn off all success messages
    this.setPostSuccessMessages(false);

    // have they set a userid for this post?
    const rating = this.ratingPostUserList.find((x) => x.postid === postId);

    if (!rating || rating.userid === 0) {
      window.alert('Please select a user to rate this post');
      return;
    }

    if (button) {
      // Pass variables to the service
      this.apiServiceUser
        .submitPostUserRating(rating.userid, postId, +button.textContent?.trim())
        .subscribe({
          next: (response) => {
            // Find the post in the listing
            const post = this.postsList.find((post) => post.postid === postId);

            if (post) {
              // Update the post rating
              post.rating = response.averageRating;
              post.successrating = true;
            }
            this.cdr.detectChanges();
          },
          error: (error) => {
            console.error('Failed to submit rating', error);
          },
        });
    }
  }

  onCommentRatingToolbarClick(event: MouseEvent, commentId: number): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    // turn off all success messages
    this.setCommentSuccessMessages(false);

    // have they set a userid for this comment?
    const rating = this.ratingCommentUserList.find((x) => x.commentid === commentId);

    if (!rating || rating.userid === 0) {
      window.alert('Please select a user to rate this comment');
      return;
    }

    if (!button) return;

    // Pass variables to the service
    this.apiServiceUser
      .submitCommentUserRating(rating.userid, commentId, +button.textContent?.trim())
      .subscribe({
        next: (response) => {
          // Update the comment and rating
          this.setCommentRating(commentId, response.averageRating, true);
          this.cdr.markForCheck();
        },
        error: (error) => {
          console.error('Failed to submit comment rating', error);
        },
      });
  }

  onDeleteCommentClick(postId: number, commentId: number) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    // delete the actual comment
    this.apiServicePost.deleteComment(commentId).subscribe({
      next: (response) => {
        // Get comments for this post
        const comments = this.commentsByPostId.get(postId) ?? [];

        // Remove the deleted comment
        this.commentsByPostId.set(
          postId,
          comments.filter((comment) => comment.postcommentid !== commentId),
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert('Unable to delete the comment.');
      },
    });
  }

  // helpers
  setCommentRating(commentid: number, rating: number, show: boolean): void {
    for (const comments of this.commentsByPostId.values()) {
      const comment = comments.find((c) => c.postcommentid === commentid);

      if (comment) {
        comment.rating = rating;
        comment.successrating = show;
        return;
      }
    }
  }

  setPostSuccessMessages(show: boolean) {
    this.postsList.forEach((post) => {
      post.successrating = false;
    });
  }
  setCommentSuccessMessages(show: boolean) {
    this.commentsByPostId.forEach((comments) => {
      comments.forEach((comment) => {
        comment.successrating = show;
      });
    });
  }

  removeItem<T>(list: T[], condition: (item: T) => boolean): void {
    const index = list.findIndex(condition);
    if (index !== -1) {
      list.splice(index, 1);
    }
  }

  getTimePassed(date: Date) {
    return this.globalService.getTimePassed(date);
  }
}

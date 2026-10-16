import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
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
  imports: [DatePipe, JsonPipe, FontAwesomeModule],
  templateUrl: './posts.html',
  styleUrl: './posts.css',
})
export class Posts implements OnInit {
  noPosts: boolean = false;
  postId: number = 0;
  userguid: string | null = null;
  rating: number = 0;
  userratingid: number = 0;
  catagoryid: number | null = null;
  searchString: string = '';
  userList!: any[];
  catagoryList!: any[];
  postsList: GetPostsByCategoryUserRating[] = [];
  ratingPostUserList: RatingPostUserList[] = [];
  ratingCommentUserList: RatingCommentUserlist[] = [];
  expandedPostGuids = new Set<string>();

  // Comments stored separately for each post
  commentsByPostGuid = new Map<string, GetPostComments[]>();

  // Track which posts have their comments expanded
  expandedPostCommentsGuids = new Set<string>();

  // Track which posts are currently loading
  loadingPostGuids = new Set<string>();

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
        const user = urlParams.get('userguid');

        if (catagory) {
          this.catagoryid = +catagory;
        }
        if (user) {
          this.userguid = user;
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
        postguid: post.postguid,
        userguid: '',
      });
    }
  }

  setratingCommentUserList() {
    this.ratingCommentUserList = [];

    // Insert all comment IDs from every loaded post
    this.commentsByPostGuid.forEach((comments) => {
      comments.forEach((comment) => {
        this.ratingCommentUserList.push({
          commentguid: comment.commentguid,
          userguid: '',
        });
      });
    });
  }

  loadPosts() {
    // get posts
    this.apiServicePost
      .getPosts(this.catagoryid, this.userguid, this.rating, this.searchString)
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
    this.userguid = user;
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
  onPostUserRatingChange(event: Event, postguid: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const userguid = selectElement.value;

    // update the record
    const record = this.ratingPostUserList.find((x) => x.postguid === postguid);

    if (record) {
      record.userguid = userguid;
    }
  }

  // dropdown
  onCommentUserRatingChange(event: Event, commentguid: string): void {
    const selectElement = event.target as HTMLSelectElement;
    const userguid = selectElement.value;

    // update the record
    const record = this.ratingCommentUserList.find((x) => x.commentguid === commentguid);

    if (record) {
      record.userguid = userguid;
    }
  }

  onViewCommentsClick(postguid: string): void {
    // If already expanded, collapse this post's comments
    if (this.expandedPostCommentsGuids.has(postguid)) {
      this.expandedPostCommentsGuids.delete(postguid);
      return;
    }

    // Expand this post independently
    this.expandedPostCommentsGuids.add(postguid);

    // Avoid loading the same comments again
    if (this.commentsByPostGuid.has(postguid)) {
      return;
    }

    this.loadingPostGuids.add(postguid);

    this.apiServicePost.getComments(postguid).subscribe({
      next: (comments: GetPostComments[]) => {
        this.commentsByPostGuid.set(postguid, comments);
        this.setratingCommentUserList();
        this.loadingPostGuids.delete(postguid);

        // Notify Angular that the view needs updating
        this.cdr.markForCheck();
      },
      error: (error) => {
        console.error('Error loading comments:', error);
        this.loadingPostGuids.delete(postguid);
      },
    });
  }

  onDeletePostClick(postguid: string) {
    const confirmed = window.confirm('Are you sure you want to delete this post?');
    if (confirmed) {
      this.apiServicePost.deletePost(postguid).subscribe({
        next: (response) => {
          // remove the record from the lists
          this.removeItem(this.postsList, (post) => post.postguid === postguid);
          this.cdr.detectChanges();
        },
        error: (error) => {
          window.alert('Error deleting this post');
        },
      });
    }
  }

  onPostRatingToolbarClick(event: MouseEvent, postguid: string): void {
    const target = event.target as HTMLElement;
    const button = target.closest('button');

    // turn off all success messages
    this.setPostSuccessMessages(false);

    // have they set a userid for this post?
    const rating = this.ratingPostUserList.find((x) => x.postguid === postguid);

    if (!rating || rating.userguid === '') {
      window.alert('Please select a user to rate this post');
      return;
    }

    if (button) {
      // Pass variables to the service
      this.apiServiceUser
        .submitPostUserRating(rating.userguid, postguid, +button.textContent?.trim())
        .subscribe({
          next: (response) => {
            // Find the post in the listing
            const post = this.postsList.find((post) => post.postguid === postguid);

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

  onDeleteCommentClick(postguid: string, commentguid: string) {
    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    // delete the actual comment
    this.apiServicePost.deleteComment(commentguid).subscribe({
      next: (response) => {
        // Get comments for this post
        const comments = this.commentsByPostGuid.get(postguid) ?? [];

        // Remove the deleted comment
        this.commentsByPostGuid.set(
          postguid,
          comments.filter((comment) => comment.commentguid !== commentguid),
        );
        this.cdr.detectChanges();
      },
      error: (error) => {
        alert('Unable to delete the comment.');
      },
    });
  }

  ontogglePost(postGuid: string): void {
    if (this.expandedPostGuids.has(postGuid)) {
      this.expandedPostGuids.delete(postGuid);
    } else {
      this.expandedPostGuids.add(postGuid);
    }
  }

  // helpers
  setCommentRating(commentguid: string, rating: number, show: boolean): void {
    for (const comments of this.commentsByPostGuid.values()) {
      const comment = comments.find((c) => c.commentguid === commentguid);

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
    this.commentsByPostGuid.forEach((comments) => {
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

  getPostPreview(post: string, maxlength: number): string {
    if (!post) {
      return '';
    }

    const plainText = this.globalService.stripHtml(post);

    return plainText.length > this.globalService.getPostMaxLengthAbbreviated()
      ? plainText.substring(0, this.globalService.getPostMaxLengthAbbreviated()) + '...'
      : plainText;
  }

  isPostExpanded(postguid: string): boolean {
    return this.expandedPostGuids.has(postguid);
  }

  hasMoreText(post: string | null | undefined): boolean {
    if (!post) {
      return false;
    }

    return (
      this.globalService.stripHtml(post).length > this.globalService.getPostMaxLengthAbbreviated()
    );
  }
}

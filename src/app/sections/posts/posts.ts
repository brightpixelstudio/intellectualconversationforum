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
//import { RatingCommentUserlist } from '../../models/posts/ratingcommentuserlist';

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
  hiddenButtonIds = new Set<string>();
  postsList: GetPostsByCategoryUserRating[] = [];
  commentList: GetPostComments[] = [];
  ratingPostUserList: RatingPostUserList[] = [];
  //  ratingCommentUserlist: RatingCommentUserlist[] = [];

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
    private router: Router,
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
    for (const post of this.postsList) {
      this.ratingPostUserList.push({
        postid: post.postid,
        userid: 0,
      });
    }
  }

  loadPosts() {
    // clear out comment list
    this.commentList.length = 0;
    // this.ratingCommentUserlist.length = 0;

    // get posts
    this.apiServicePost
      .getPosts(this.catagoryid, this.userid, this.rating, this.searchString)
      .subscribe({
        next: (data: GetPostsByCategoryUserRating[]) => {
          this.postsList = data;
          this.noPosts = false;
          this.setratingPostUserList();
          // turn off all success messages
          this.setSuccessMessages(false);
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
    // const record = this.ratingCommentUserlist.find((x) => x.commentid === commentId);

    //if (record) {
    //  record.userid = userId;
    //}
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
        this.loadingPostIds.delete(postId);
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
          // remove comments also
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
    this.setSuccessMessages(false);

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

  onCommentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // get the postid and commentid
    let commentClass = Array.from(target.classList).find((className) =>
      className.startsWith('comment-'),
    );
    let postClass = Array.from(target.classList).find((className) => className.startsWith('post-'));
    if (!commentClass || !postClass) return;

    const postId: string = postClass.substring(postClass.indexOf('-') + 1);
    const commentId: string = commentClass.substring(commentClass.indexOf('-') + 1);

    // is this a delete?
    if (target.classList.contains('deletecommentbtn')) {
      this.deleteComment(+commentId, postId);
    } else {
      this.router.navigate(['/editcomment'], {
        queryParams: { commentid: commentId },
      });
    }
  }

  // helpers
  setSuccessMessages(show: boolean) {
    this.postsList.forEach((post) => {
      post.successrating = false;
    });
  }

  deleteComment(commentId: number, postId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
      // delete all these comments from this post
      this.commentList = this.commentList.filter((comment) => comment.postid !== +postId);

      // delete the actual comment
      this.apiServicePost.deleteComment(commentId).subscribe({
        next: (response) => {
          // reload the comments for this post
          //          this.onViewCommentsClick(+postId);
          this.cdr.detectChanges();
        },
        error: (error) => {
          window.alert('Error deleting this post');
        },
      });
    }
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

  mediumDateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  });
}

import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServicePost } from '../../services/postservice';
import { GlobalService } from '../../services/globalservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPost } from '../../models/posts/getpost';
import { GetPostComments } from '../../models/posts/getpostcomments';
import { RatingCommentUserlist } from '../../models/posts/ratingcommentuserlist';

@Component({
  selector: 'post',
  imports: [DatePipe],
  templateUrl: './post.html',
  styleUrl: './post.css',
})
export class Post implements OnInit {
  timePassed?: string;
  postguid: string = '';
  userguid: string = '';
  rating: number = 0;
  userList!: any[];
  showRatingSuccess = false;
  thePost: GetPost | null = null;
  theComments: GetPostComments[] = [];
  ratingCommentUserList: RatingCommentUserlist[] = [];

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServicePost: ApiServicePost,
    private globalService: GlobalService,
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
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.thePost = response.post[0];
        this.theComments = response.comments;
        this.rating = this.thePost.rating;
        this.timePassed = this.globalService.getTimePassed(this.thePost.dateadded);
        this.setratingCommentUserList();
        this.cdr.detectChanges();
        console.log(this.theComments);
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  onUserChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.userguid = select.value;
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

  setratingCommentUserList() {
    this.ratingCommentUserList = [];

    /* Insert all comment IDs from every loaded post
    this.commentsByPostGuid.forEach((comments) => {
      comments.forEach((comment) => {
        this.ratingCommentUserList.push({
          commentguid: comment.commentguid,
          userguid: '',
        });
      });
    });
    */
  }
}

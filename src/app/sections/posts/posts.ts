import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { forkJoin } from 'rxjs';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceUtility } from '../../services/utilityservice';
import { ApiServicePost } from '../../services/postservice';
import { GlobalService } from '../../services/globalservice';
import { GetPostsByCategoryUser } from '../../models/posts/getpostsbycategoryuser';
import { GetPostComments } from '../../models/posts/getpostcomments';

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
  catagoryid: number | null = null;
  userList!: any[];
  catagoryList!: any[];
  hiddenButtonIds = new Set<string>();
  postsList: GetPostsByCategoryUser[] = [];
  commentList: GetPostComments[] = [];

  constructor(
    private apiServiceUser: ApiServiceUser,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServicePost: ApiServicePost,
    private globalService: GlobalService,
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

  loadPosts() {
    this.apiServicePost.getPosts(this.catagoryid, this.userid).subscribe({
      next: (data: GetPostsByCategoryUser[]) => {
        this.postsList = data;
        this.noPosts = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.noPosts = true;
        this.cdr.detectChanges();
      },
    });
  }

  // events
  onCatagoryChange(catagory: string) {
    this.catagoryid = +catagory;
    this.loadPosts();
  }

  onUserChange(user: string) {
    this.userid = +user;
    this.loadPosts();
  }

  onCommentsClick(postId: string) {
    // add to the hide button list
    this.hiddenButtonIds.add(postId);

    // get the element from the list
    const post = this.postsList.find((post) => post.postid === +postId);

    if (post) {
      this.postId = +postId;
      // get the comments
      this.apiServicePost.getComments(+postId).subscribe({
        next: (data: GetPostComments[]) => {
          // we add to the comment list in case they want to delete one.
          this.commentList = [...this.commentList, ...data];
          let comments = this.buildCommemts();

          // set the comments
          let content = `<div class="row mt-3 ms-4"><div class="col-11">${comments}</div></row>`;
          post.comments = content;
          this.cdr.detectChanges();
        },
        error: (_err: unknown) => {},
      });
    }
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

  onCommentClick(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // get the postid and commentid
    let commentClass = Array.from(target.classList).find((className) =>
      className.startsWith('comment-'),
    );
    let postClass = Array.from(target.classList).find((className) => className.startsWith('post-'));
    if (!commentClass || !postClass) return;

    // remove all comments in the list for this post
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
  deleteComment(commentId: number, postId: string) {
    const confirmed = window.confirm('Are you sure you want to delete this comment?');
    if (confirmed) {
      // delete all these comments from this post
      this.commentList = this.commentList.filter((comment) => comment.postid !== +postId);

      // delete the actual comment
      this.apiServicePost.deleteComment(commentId).subscribe({
        next: (response) => {
          // reload the comments for this post
          this.onCommentsClick(postId);
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

  buildCommemts(): string {
    // build the content
    let comments: string = '';
    for (const comment of this.commentList) {
      if (this.postId != comment.postid) continue;

      // title
      const newDate = new Date(comment.dateadded);
      const timePassed = this.globalService.getTimePassed(newDate);
      const mediumDate = this.mediumDateFormatter.format(newDate);
      let title = `<p class='comment' ><strong>${comment.name}</strong>, <span class="posttitleinfo">${mediumDate}, ${timePassed}</span></p>`;

      // edit / delete button
      let editdeletebtn = `<div><a class='btn btn-primary editcommentbtn mt-2 me-1 post-${comment.postid} comment-${comment.postcommentid}'>Edit</a><a class='btn btn-danger deletecommentbtn mt-2 post-${comment.postid} comment-${comment.postcommentid}'>Delete</a></div>`;

      // comment
      let theComment = comment.comment + editdeletebtn + '<hr/>';

      // add to the comments
      comments += title + theComment;
    }
    return comments;
  }

  getTimePassed(date: Date) {
    return this.globalService.getTimePassed(date);
  }

  mediumDateFormatter = new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
  });
}

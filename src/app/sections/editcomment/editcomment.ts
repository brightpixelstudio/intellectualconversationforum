import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import {
  FormsModule,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
  FormBuilder,
} from '@angular/forms';
import { profanityValidator } from '../../utils/bad-words-validator';
import { ApiServicePost } from '../../services/postservice';
import { ApiServiceUser } from '../../services/userservice';
import { ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { GetComment } from '../../models/posts/getcomment';
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'editcomment',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, QuillModule],
  templateUrl: './editcomment.html',
  styleUrl: './editcomment.css',
})
export class EditComment implements OnInit {
  timePassed?: string;
  userList!: any[];
  commentId: number = 0;
  getComment: GetComment | null = null;
  updateCommentForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiServicePost: ApiServicePost,
    private apiServiceUser: ApiServiceUser,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.modules = this.globalService.getQuillModuleToolbar();
  }

  ngOnInit(): void {
    this.updateCommentForm = this.fb.group({
      userid: new FormControl('', [Validators.required]),
      comment: new FormControl('', [
        Validators.required,
        Validators.maxLength(5000),
        profanityValidator(),
      ]),
    });

    forkJoin({
      users: this.apiServiceUser.getUserList(),
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });

    // get the query string value
    const commentId = this.route.snapshot.queryParamMap.get('commentid');
    if (!commentId) return;
    this.commentId = +commentId;

    // load the comment
    this.apiServicePost.getComment(this.commentId).subscribe({
      next: (GetComment) => {
        this.getComment = GetComment[0];
        this.updateCommentForm.patchValue(GetComment[0]);
        this.timePassed = this.globalService.getTimePassed(this.getComment.dateadded);
      },
      error: (err) => console.error('Failed to load post', err),
    });
  }

  checkQuillLength(event: any) {
    this.currentQuillLength = this.globalService.checkQuillLength(5000, event);
  }

  get f() {
    return this.updateCommentForm.controls;
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.updateCommentForm.valid) {
      // Pass the raw form values to your service
      this.apiServicePost
        .submitUpdateCommentForm(this.commentId, this.updateCommentForm.value)
        .subscribe({
          next: (response) => {
            this.showSuccess = true;
            this.cdr.detectChanges();
          },
          error: (error: HttpErrorResponse) => {
            // Handle Bad Request (400) or other HTTP errors
            this.showError = true;
            if (error.status === 400) {
              // Fallback to error.message if the backend response didn't include a custom text message
              this.errorMsg =
                error.error?.message || 'Invalid data submitted. Please check your form.';
            } else {
              this.errorMsg = 'An unexpected error occurred. Please try again.';
            }
            this.cdr.detectChanges();
          },
        });
    } else {
      console.log('Form is invalid');
    }
  }
}

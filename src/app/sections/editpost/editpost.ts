import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
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
import { ApiServiceUtility } from '../../services/utilityservice';
import { ApiServicePost } from '../../services/postservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPost } from '../../models/posts/getpost';
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'editpost',
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, DatePipe, QuillModule],
  templateUrl: './editpost.html',
  styleUrl: './editpost.css',
})
export class EditPost implements OnInit {
  timePassed?: string;
  postId: number = 0;
  getPost: GetPost | null = null;
  catagoryList!: any[];
  updatePostForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServicePost: ApiServicePost,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.modules = this.globalService.getQuillModuleToolbar();
  }

  ngOnInit(): void {
    this.updatePostForm = this.fb.group({
      postcatagoryid: new FormControl('', [Validators.required]),
      userid: new FormControl('', [Validators.required]),
      post: new FormControl('', [
        Validators.required,
        Validators.maxLength(5000),
        profanityValidator(),
      ]),
    });

    forkJoin({
      catagories: this.apiServiceUtilities.getCatagoryList(),
    }).subscribe({
      next: (response) => {
        this.catagoryList = response.catagories;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });

    // get the query string value
    const postId = this.route.snapshot.queryParamMap.get('postid');
    if (!postId) return;
    this.postId = +postId;

    // load the post
    this.apiServicePost.getPost(this.postId).subscribe({
      next: (GetPost) => {
        this.getPost = GetPost[0];
        this.updatePostForm.patchValue(GetPost[0]);
        this.timePassed = this.globalService.getTimePassed(this.getPost.dateadded);
      },
      error: (err) => console.error('Failed to load post', err),
    });
  }

  checkQuillLength(event: any) {
    this.currentQuillLength = this.globalService.checkQuillLength(5000, event);
  }

  get f() {
    return this.updatePostForm.controls;
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.updatePostForm.valid) {
      // Pass the raw form values to your service
      this.apiServicePost.submitUpdatePostForm(this.postId, this.updatePostForm.value).subscribe({
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

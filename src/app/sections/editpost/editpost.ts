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
import { ApiServiceUser } from '../../services/userservice';
import { ApiServicePost } from '../../services/postservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GetPost } from '../../models/posts/getpost';
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'editpost',
  imports: [ReactiveFormsModule, FormsModule, DatePipe, QuillModule],
  templateUrl: './editpost.html',
  styleUrl: './editpost.css',
})
export class EditPost implements OnInit {
  timePassed?: string;
  postguid: string = '';
  userguid: string = '';
  getPost: GetPost | null = null;
  rating: number = 0;
  catagoryList!: any[];
  userList!: any[];
  updatePostForm!: FormGroup;
  showRatingSuccess = false;
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
    private apiServiceUser: ApiServiceUser,
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

    // GetAllMemberNames;
    forkJoin({
      catagories: this.apiServiceUtilities.getCatagoryList(),
      users: this.apiServiceUser.getUserList(),
    }).subscribe({
      next: (response) => {
        this.catagoryList = response.catagories;
        this.userList = response.users;
        this.userguid = this.userList[0].userguid;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });

    // get the query string value
    const postguid = this.route.snapshot.queryParamMap.get('postguid');
    if (!postguid) return;
    this.postguid = postguid;

    // load the post
    this.apiServicePost.getPost(this.postguid).subscribe({
      next: (GetPost) => {
        this.getPost = GetPost[0];
        this.rating = this.getPost.rating;
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

  onUserChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.userguid = select.value;
  }

  onRatingToolbarClick(event: MouseEvent, postguid: string): void {
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

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.updatePostForm.valid) {
      // Pass the raw form values to your service
      this.apiServicePost.submitUpdatePostForm(this.postguid, this.updatePostForm.value).subscribe({
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

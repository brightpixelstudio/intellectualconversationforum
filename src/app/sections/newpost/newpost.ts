import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { JsonPipe } from '@angular/common';
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
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceUtility } from '../../services/utilityservice';
import { ApiServicePost } from '../../services/postservice';
import { forkJoin } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'newpost',
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, QuillModule],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css',
})
export class NewPost implements OnInit {
  userList!: any[];
  catagoryList!: any[];
  postForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiServiceUser: ApiServiceUser,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServicePost: ApiServicePost,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private globalService: GlobalService,
  ) {
    this.modules = this.globalService.getQuillModuleToolbar();
  }

  ngOnInit(): void {
    this.postForm = this.fb.group({
      catagoryid: new FormControl('', [Validators.required]),
      userid: new FormControl('', [Validators.required]),
      post: new FormControl('', [
        Validators.required,
        Validators.maxLength(5000),
        profanityValidator(),
      ]),
    });

    forkJoin({
      users: this.apiServiceUser.getUserList(),
      catagories: this.apiServiceUtilities.getCatagoryList(),
    }).subscribe({
      next: (response) => {
        this.userList = response.users;
        this.catagoryList = response.catagories;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });
  }

  checkQuillLength(event: any) {
    const quill = event.editor;
    // Quill adds a trailing newline ('\n'), so getLength() is always text + 1
    this.currentQuillLength = quill.getLength() - 1;

    if (quill.getLength() > this.maxLimit) {
      // Revert/delete the characters that exceed the limit
      quill.deleteText(this.maxLimit, quill.getLength());
      this.currentQuillLength = this.maxLimit;
    }
  }

  get f() {
    return this.postForm.controls;
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.postForm.valid) {
      // Pass the raw form values to your service
      this.apiServicePost.submitNewPostForm(this.postForm.value).subscribe({
        next: (response) => {
          this.postForm.reset();
          this.showSuccess = true;
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

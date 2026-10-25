import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
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
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'newpost',
  imports: [ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './newpost.html',
  styleUrl: './newpost.css',
})
export class NewPost implements OnInit {
  userguid: string = '';
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
    public authService: AuthService,
    private globalService: GlobalService,
  ) {
    this.modules = this.globalService.getQuillModuleToolbar();
  }

  ngOnInit(): void {
    this.userguid = this.authService.getUserGuid() ?? '';
    this.postForm = this.fb.group({
      catagoryid: new FormControl('', [Validators.required]),
      guid: new FormControl({ value: this.userguid, disabled: true }, [Validators.required]),
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
    this.currentQuillLength = this.globalService.checkQuillLength(5000, event);
  }

  get f() {
    return this.postForm.controls;
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;
    this.errorMsg = '';

    if (this.postForm.valid) {
      const postData = this.postForm.getRawValue();
      this.apiServicePost.submitNewPostForm(postData).subscribe({
        next: (response) => {
          this.postForm.reset();
          this.showSuccess = true;
          this.cdr.detectChanges();
        },

        error: (error: HttpErrorResponse) => {
          this.showError = true;

          if (error.status === 400) {
            this.errorMsg =
              error.error?.message || 'Invalid data submitted. Please check your form.';
          } else if (error.status === 409) {
            // Duplicate post
            this.errorMsg = error.error?.message || 'You have already posted this text.';
          } else {
            this.errorMsg =
              error.error?.message || 'An unexpected error occurred. Please try again.';
          }

          this.cdr.detectChanges();
        },
      });
    } else {
      this.postForm.markAllAsTouched();
      console.log('Form is invalid');
    }
  }
}

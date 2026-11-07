import { Component, OnInit, inject, ChangeDetectorRef } from '@angular/core';
import { AuthService } from '../../services/auth';
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
import { RatingComponent } from './../rating/rating';
import { DecimalPipe } from '@angular/common';
import { PostImagesComponent } from './../postimages/postimages/postimages';
import { PostImage } from '../../models/posts/postimage';
import { SelectedPostImage } from '../../models/posts/seletedpostimage';

@Component({
  selector: 'editpost',
  imports: [
    ReactiveFormsModule,
    FormsModule,
    DatePipe,
    QuillModule,
    RatingComponent,
    DecimalPipe,
    PostImagesComponent,
  ],
  templateUrl: './editpost.html',
  styleUrl: './editpost.css',
})
export class EditPost implements OnInit {
  timePassed?: string;
  postguid: string = '';
  userguid: string = '';
  thePost: GetPost | null = null;
  catagoryList!: any[];
  userList!: any[];
  updatePostForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  // Post image management
  removedPostImages: PostImage[] = [];
  // Post image management
  selectedImages: SelectedPostImage[] = [];
  postImagesError: string = '';
  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiServiceUtilities: ApiServiceUtility,
    private apiServiceUser: ApiServiceUser,
    private apiServicePost: ApiServicePost,
    public authService: AuthService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    public globalService: GlobalService,
  ) {
    this.modules = this.globalService.getQuillModuleToolbar();
  }

  ngOnInit(): void {
    this.userguid = this.authService.getUserGuid() ?? '';
    this.updatePostForm = this.fb.group({
      postcatagoryid: new FormControl('', [Validators.required]),
      guid: new FormControl({ value: this.userguid, disabled: true }, [Validators.required]),
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
        this.cdr.detectChanges();
      },
      error: (err) => console.error('One of the requests failed!', err),
    });

    // get the query string value
    const postguid = this.route.snapshot.queryParamMap.get('postguid');
    if (!postguid) return;
    this.postguid = postguid;

    // load the post
    this.apiServicePost.getPost(this.postguid, this.userguid).subscribe({
      next: (GetPost) => {
        this.thePost = GetPost[0];
        this.updatePostForm.patchValue(GetPost[0]);
        this.timePassed = this.globalService.getTimePassed(this.thePost.dateadded);
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

  // Post rating
  onPostRatingSelected(rating: number): void {
    if (!this.thePost) return;

    this.thePost.successrating = false;

    this.apiServiceUser.submitPostUserRating(this.userguid, this.postguid, rating).subscribe({
      next: (response) => {
        if (!this.thePost) return;

        this.thePost.rating = response.ratingAverage;
        this.thePost.ratingcount = response.ratingCount;
        this.thePost.userrating = rating;
        this.thePost.successrating = true;

        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Failed to submit rating', error);
      },
    });
  }

  // images
  onPostImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.postImagesError = '';

    // Allow selecting the same file again
    input.value = '';

    if (files.length === 0) return;

    const existingCount = this.thePost?.postimages?.length ?? 0;

    // Check maximum number of images
    if (
      existingCount + this.selectedImages.length + files.length >
      this.globalService.getMaxPostImages()
    ) {
      this.postImagesError = `You can upload a maximum of ${this.globalService.getMaxPostImages()} images.`;
      return;
    }

    // Validate all selected files before adding any
    for (const file of files) {
      if (!this.globalService.getAllowedImageTypes().includes(file.type)) {
        this.postImagesError = `${file.name} is not a supported image type.`;
        return;
      }

      if (file.size > this.globalService.getMaxPostFileMaxLength()) {
        this.postImagesError = `${file.name} exceeds the maximum image size of 1 MB.`;
        return;
      }
    }

    // Add images and generate previews
    for (const file of files) {
      this.selectedImages.push({
        file,
        previewUrl: URL.createObjectURL(file),
      });
    }

    this.cdr.detectChanges();
  }

  removeSelectedPostImage(index: number): void {
    const image = this.selectedImages[index];

    if (!image) return;

    URL.revokeObjectURL(image.previewUrl);
    this.selectedImages.splice(index, 1);
    this.postImagesError = '';

    this.cdr.detectChanges();
  }

  // remove the image from the post
  onRemovePostImage(image: PostImage): void {
    this.removedPostImages.push(image);

    if (this.thePost) {
      this.thePost.postimages = this.thePost.postimages.filter(
        (img) => img.postimageid !== image.postimageid,
      );
    }

    this.postImagesError = '';
    this.cdr.detectChanges();
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.updatePostForm.valid) {
      // Pass the raw form values to your service
      const postData = this.updatePostForm.getRawValue();
      this.apiServicePost.submitUpdatePostForm(this.postguid, postData).subscribe({
        next: (response) => {
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
      console.log('Form is invalid');
    }
  }
}

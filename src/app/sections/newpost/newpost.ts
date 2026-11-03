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
import { SelectedPostImage } from '../../models/posts/seletedpostimage';

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
  selectedImages: SelectedPostImage[] = [];
  postForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  postImagesError: string = '';
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
    public globalService: GlobalService,
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

  // images
  onPostImagesSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);

    this.postImagesError = '';

    // Allow selecting the same file again
    input.value = '';

    if (files.length === 0) {
      return;
    }

    // Check maximum number of images
    if (this.selectedImages.length + files.length > this.globalService.getMaxPostImages()) {
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
        file: file,
        previewUrl: URL.createObjectURL(file),
      });
    }
  }

  removePostImage(index: number): void {
    const image = this.selectedImages[index];

    if (!image) {
      return;
    }

    // Release the preview URL
    URL.revokeObjectURL(image.previewUrl);

    // Remove image from selected images
    this.selectedImages.splice(index, 1);

    // Clear any previous validation error
    this.postImagesError = '';
  }

  // save
  onSubmit(): void {
    this.showSuccess = false;
    this.showError = false;
    this.errorMsg = '';

    if (this.postForm.valid) {
      const postData = this.postForm.getRawValue();

      const formData = new FormData();

      // Add existing post fields
      Object.entries(postData).forEach(([key, value]) => {
        if (value !== null && value !== undefined) {
          formData.append(key, String(value));
        }
      });

      // Add selected images
      this.selectedImages.forEach((image) => {
        formData.append('images', image.file, image.file.name);
      });

      this.apiServicePost.submitNewPostForm(formData).subscribe({
        next: (response) => {
          this.postForm.reset();

          // Release preview URLs
          this.selectedImages.forEach((image) => {
            URL.revokeObjectURL(image.previewUrl);
          });

          this.selectedImages = [];
          this.postImagesError = '';

          this.showSuccess = true;
          this.cdr.detectChanges();
        },

        error: (error: HttpErrorResponse) => {
          this.showError = true;

          if (error.status === 400) {
            this.errorMsg =
              error.error?.message || 'Invalid data submitted. Please check your form.';
          } else if (error.status === 409) {
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

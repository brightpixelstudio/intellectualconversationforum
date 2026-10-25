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
import { GetProfileMember } from '../../models/member/getprofilemember';
import { GlobalService } from '../../services/globalservice';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'editprofile',
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './editprofile.html',
  styleUrl: './editprofile.css',
})
export class EditProfile implements OnInit {
  updateProfileForm!: FormGroup;
  userguid: string = '';
  showSuccess = false;
  showError = false;
  errorMsg = '';

  // image
  profileImage: File | null = null;
  profileImagePreview: string | null = null;
  profileImageError = '';
  isFormattingImage = false;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceUser,
    private apiServiceUtility: ApiServiceUtility,
    private globalService: GlobalService,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.updateProfileForm = this.fb.group({
      name: new FormControl('', [
        Validators.required,
        Validators.minLength(8),
        profanityValidator(),
      ]),
      username: new FormControl('', [
        Validators.required,
        Validators.minLength(7),
        Validators.pattern(/^\S*$/),
        profanityValidator(),
      ]),
      email: ['', [Validators.required, Validators.email]],
      zipcode: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(5),
        Validators.pattern(/^[0-9]{5}$/),
      ]),
      profile: new FormControl('', [
        Validators.required,
        Validators.minLength(30),
        Validators.maxLength(1000),
        profanityValidator(),
      ]),
    });

    // get the query string value
    const userguid = this.route.snapshot.queryParamMap.get('userguid');
    if (!userguid) {
      return;
    }
    this.userguid = userguid;

    // load the members profile
    this.apiService.getUserProfile(this.userguid).subscribe({
      next: (GetProfileMember) => {
        this.updateProfileForm.patchValue(GetProfileMember);
        this.profileImagePreview = GetProfileMember.profileimageurl ?? null;
      },
      error: (err) => console.error('Failed to load user profile', err),
    });
  }

  onZipcodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 5);

    input.value = value;

    this.updateProfileForm.get('zipcode')?.setValue(value);
  }

  get f() {
    return this.updateProfileForm.controls;
  }

  onProfileImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];

    this.profileImageError = '';

    if (!file) {
      return;
    }

    // is it the correct type?
    if (!this.globalService.allowedProfileImageTypes.includes(file.type)) {
      this.profileImageError = 'Please select a JPG, JPEG, JFIF, PNG, or WebP image.';
      input.value = '';
      return;
    }

    // Maximum file size: 250 KB
    if (file.size > this.globalService.getProfileFileMaxLength()) {
      this.profileImageError = 'The image must be 250 KB or smaller.';
      input.value = '';
      return;
    }

    this.isFormattingImage = true;
    this.profileImage = file;

    const reader = new FileReader();

    reader.onload = () => {
      this.profileImagePreview = reader.result as string;
      this.isFormattingImage = false;
      this.cdr.detectChanges();
    };

    reader.onerror = () => {
      this.profileImageError = 'Unable to read the selected image.';
      this.isFormattingImage = false;
      this.cdr.detectChanges();
    };

    reader.readAsDataURL(file);
  }

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.updateProfileForm.invalid) {
      this.updateProfileForm.markAllAsTouched();
      return;
    }

    // Validate the zipcode
    this.apiServiceUtility
      .getVerifyZipcode(this.updateProfileForm.get('zipcode')?.value)
      .subscribe({
        next: (result) => {
          if (result && result.length > 0 && result[0].isValid === 1) {
            // Create multipart form data
            const formData = new FormData();

            // Add registration form fields
            Object.entries(this.updateProfileForm.value).forEach(([key, value]) => {
              if (value !== null && value !== undefined) {
                formData.append(key, String(value));
              }
            });

            // Add the optional profile image
            if (this.profileImage) {
              formData.append('profileImage', this.profileImage, this.profileImage.name);
            }

            // Pass the raw form values to your service
            this.apiService.submitUpdateProfileForm(this.userguid, formData).subscribe({
              next: (response) => {
                this.showSuccess = true;
                this.cdr.detectChanges();
              },
              error: (error: HttpErrorResponse) => {
                this.showSuccess = false;
                this.showError = true;
                if (error.status === 400) {
                  // Invalid image or invalid form data
                  this.errorMsg =
                    error.error?.message ??
                    'The submitted information or image is invalid. Please check your form and try again.';
                } else if (error.status === 413) {
                  // Uploaded image is too large
                  this.errorMsg = 'The image is too large. Please select a smaller image.';
                } else if (error.status === 415) {
                  // Unsupported image format
                  this.errorMsg =
                    'This image format is not supported. Please select a JPEG, PNG, or WebP image.';
                } else if (error.status === 503) {
                  // Azure AI Content Safety service unavailable
                  this.errorMsg =
                    error.error?.message ??
                    'Image safety scanning is temporarily unavailable. Please try again later.';
                } else if (error.status === 0) {
                  // Network error or server unavailable
                  this.errorMsg =
                    'Unable to connect to the server. Please check your connection and try again.';
                } else {
                  this.errorMsg =
                    error.error?.message ?? 'An unexpected error occurred. Please try again.';
                }
              },
            });
          } else {
            this.showError = true;
            this.errorMsg = 'Invalid ZIP code. Please enter a valid ZIP code.';
            this.cdr.detectChanges();
          }
        },
      });
  }
  // helpers
  removeProfileImage(): void {
    this.profileImage = null;
    this.profileImagePreview = null;
    this.profileImageError = '';

    const input = document.getElementById('profileImage') as HTMLInputElement | null;

    if (input) {
      input.value = '';
    }
  }
}

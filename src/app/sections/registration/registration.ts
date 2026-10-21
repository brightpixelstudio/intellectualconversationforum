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
import {
  passwordStrengthValidator,
  confirmPasswordValidator,
} from '../../utils/password-validators/password-validators';
import { profanityValidator } from '../../utils/bad-words-validator';
import { ApiServiceUser } from '../../services/userservice';
import { ApiServiceUtility } from '../../services/utilityservice';
import { GlobalService } from '../../services/globalservice';
import { QuillModule } from 'ngx-quill';

@Component({
  selector: 'registration',
  imports: [ReactiveFormsModule, FormsModule, QuillModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  registerForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';

  // image
  profileImage: File | null = null;
  profileImagePreview: string | null = null;
  profileImageError = '';
  isFormattingImage = false;

  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceUser,
    private apiServiceUtility: ApiServiceUtility,
    private globalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
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
        password: [
          '',
          [
            Validators.required,
            Validators.minLength(8), // Native length check
            passwordStrengthValidator(), // Custom strength check
          ],
        ],
        confirmPassword: ['', [Validators.required]],
        profile: new FormControl('', [
          Validators.required,
          Validators.minLength(30),
          Validators.maxLength(1000),
          profanityValidator(),
        ]),
      },
      {
        // Apply cross-field validation rules to the whole FormGroup
        validators: [confirmPasswordValidator('password', 'confirmPassword')],
      },
    );
  }

  onZipcodeInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    const value = input.value.replace(/[^0-9]/g, '').slice(0, 5);

    input.value = value;

    this.registerForm.get('zipcode')?.setValue(value);
  }

  checkQuillLength(event: any) {
    const quill = event.editor;
    this.currentQuillLength = quill.getLength() - 1;

    if (quill.getLength() > this.maxLimit) {
      // Revert/delete the characters that exceed the limit
      quill.deleteText(this.maxLimit, quill.getLength());
      this.currentQuillLength = this.maxLimit;
    }
  }

  get f() {
    return this.registerForm.controls;
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

    if (!this.registerForm.valid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    // Validate the zipcode
    this.apiServiceUtility.getVerifyZipcode(this.registerForm.get('zipcode')?.value).subscribe({
      next: (result) => {
        if (result && result.length > 0 && result[0].isValid === 1) {
          // submit the registration form if the zipcode is valid

          // Create multipart form data
          const formData = new FormData();

          // Add registration form fields
          Object.entries(this.registerForm.value).forEach(([key, value]) => {
            if (value !== null && value !== undefined) {
              formData.append(key, String(value));
            }
          });

          // Add the optional profile image
          if (this.profileImage) {
            formData.append('profileImage', this.profileImage, this.profileImage.name);
          }

          // Pass the raw form values to your service
          this.apiService.submitRegistrationForm(formData).subscribe({
            next: (response) => {
              this.registerForm.reset();
              this.removeProfileImage();
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

              this.cdr.detectChanges();
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

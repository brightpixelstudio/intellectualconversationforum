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
  imports: [ReactiveFormsModule, FormsModule, JsonPipe, QuillModule],
  templateUrl: './registration.html',
  styleUrl: './registration.css',
})
export class Registration implements OnInit {
  registerForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  // quill
  modules: any;
  maxLimit: number = 5000;
  currentQuillLength: number = 0;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiServiceUser,
    private apiServiceUtility: ApiServiceUtility,
    private cdr: ChangeDetectorRef,
    private globalService: GlobalService,
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

  onSubmit() {
    this.showSuccess = false;
    this.showError = false;

    if (this.registerForm.valid) {
      // Validate the zipcode
      this.apiServiceUtility.getVerifyZipcode(this.registerForm.get('zipcode')?.value).subscribe({
        next: (result) => {
          if (result && result.length > 0 && result[0].isValid === 1) {
            // submit the registration form if the zipcode is valid
            // Pass the raw form values to your service
            this.apiService.submitRegistrationForm(this.registerForm.value).subscribe({
              next: (response) => {
                this.registerForm.reset();
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
              },
            });
          } else {
            this.showError = true;
            this.errorMsg = 'Invalid ZIP code. Please enter a valid ZIP code.';
            this.cdr.detectChanges();
          }
        },
      });
    } else {
      console.log('Form is invalid');
    }
  }
}

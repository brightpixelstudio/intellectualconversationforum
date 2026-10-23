import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ReactiveFormsModule, FormGroup, Validators, FormBuilder } from '@angular/forms';
import { AuthService } from '../../services/auth';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  showSuccess = false;
  showError = false;
  errorMsg = '';
  isSubmitting = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private cdr: ChangeDetectorRef,
    private router: Router,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      login: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });

    if (this.authService.isLoggedIn()) {
      this.navigateToReturnUrl();
    }
  }

  get f() {
    return this.loginForm.controls;
  }

  private navigateToReturnUrl(defaultUrl: string = '/posts'): void {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || defaultUrl;

    // Only allow internal application URLs.
    if (!returnUrl.startsWith('/') || returnUrl.startsWith('//')) {
      this.router.navigateByUrl(defaultUrl);
      return;
    }

    this.router.navigateByUrl(returnUrl);
  }

  onSubmit(): void {
    this.showSuccess = false;
    this.showError = false;
    this.errorMsg = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;

    this.authService
      .login({
        login: this.loginForm.get('login')?.value.trim(),
        password: this.loginForm.get('password')?.value,
      })
      .subscribe({
        next: () => {
          // AuthService stores the JWT token.
          this.isSubmitting = false;

          // Return to the requested page, including its query string.
          this.navigateToReturnUrl();
        },
        error: (error: HttpErrorResponse) => {
          this.showSuccess = false;
          this.showError = true;
          this.isSubmitting = false;

          if (error.status === 401) {
            this.errorMsg = 'Invalid username/email or password.';
          } else if (error.status === 0) {
            this.errorMsg = 'Unable to connect to the server. Please try again.';
          } else {
            this.errorMsg =
              error.error?.message ?? 'An unexpected error occurred. Please try again.';
          }

          this.cdr.detectChanges();
        },
      });
  }
}

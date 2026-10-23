import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login/loginrequest';
import { LoginResponse } from '../models/login/loginresponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly apiUrl = 'https://localhost:7043/api/Auth';
  private readonly tokenStorageKey = 'accessToken';

  //  private accessToken: string | null = localStorage.getItem(this.tokenStorageKey);
  private accessToken: string | null = localStorage.getItem('accessToken');

  constructor(
    private http: HttpClient,
    private router: Router,
  ) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.accessToken = response.token;
        localStorage.setItem('accessToken', response.token);
        //sessionStorage.setItem(this.tokenStorageKey, response.token);
      }),
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    if (!this.accessToken) {
      return false;
    }

    try {
      const payload = this.accessToken.split('.')[1];

      if (!payload) {
        this.clearToken();
        return false;
      }

      const decodedPayload = JSON.parse(
        atob(this.accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')),
      );

      // JWT expiration is expressed in seconds.
      const expiration = decodedPayload.exp;

      if (typeof expiration !== 'number' || expiration * 1000 <= Date.now()) {
        this.clearToken();
        return false;
      }

      return true;
    } catch {
      this.clearToken();
      return false;
    }
  }

  private clearToken(): void {
    this.accessToken = null;
    sessionStorage.removeItem(this.tokenStorageKey);
  }

  logout(): void {
    this.clearToken();
    this.router.navigate(['/']);
  }
}

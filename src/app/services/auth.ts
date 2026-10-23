import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { LoginRequest } from '../models/login/loginrequest';
import { LoginResponse } from '../models/login/loginresponse';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  // Local .NET API URL for development.
  private readonly apiUrl = 'https://localhost:7043/api/Auth';

  private accessToken: string | null = null;

  constructor(private http: HttpClient) {}

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, request).pipe(
      tap((response) => {
        this.accessToken = response.token;
      }),
    );
  }

  getAccessToken(): string | null {
    return this.accessToken;
  }

  isLoggedIn(): boolean {
    return this.accessToken !== null;
  }

  logout(): void {
    this.accessToken = null;
  }
}

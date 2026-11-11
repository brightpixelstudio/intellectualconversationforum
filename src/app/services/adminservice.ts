import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { MemberSearch } from '../models/admin/membersearch';

@Injectable({
  providedIn: 'root',
})
export class ApiServiceAdmin {
  private http = inject(HttpClient);
  private apiUrl = environment.apiUrl + '/Admin';

  verifyAdminAccess(): Observable<{ isAdmin: boolean }> {
    return this.http.get<{ isAdmin: boolean }>(this.apiUrl + '/VerifyAdminAccess');
  }

  searchMembers(searchText: string): Observable<MemberSearch[]> {
    return this.http.get<MemberSearch[]>(`${this.apiUrl}/SearchMembers`, {
      params: { searchText },
    });
  }
}

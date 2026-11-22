import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceAdmin } from '../../../../../services/adminservice';
import { GlobalService } from '../../../../../services/globalservice';
import { GetNonActiveMembers } from '../../../../../models/admin/getallnonactivemembers';
import { AccountStatus } from '../../../../../enums/accountstatus';

@Component({
  selector: 'nonactivemembers',
  imports: [FormsModule, DatePipe],
  templateUrl: './nonactivemembers.html',
  styleUrl: './nonactivemembers.css',
})
export class NonActiveMembers implements OnInit {
  startDate = '';
  endDate = '';
  getNonActiveMembers: GetNonActiveMembers[] = [];
  showError = false;
  errorMsg = '';

  constructor(
    private apiService: ApiServiceAdmin,
    private apiGlobalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const today = new Date();
    this.endDate = this.formatDate(today);
    const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
    this.startDate = this.formatDate(firstDay);
  }

  loadNonActiveMembers() {
    this.apiService.getNonActiveMembers(this.startDate, this.endDate).subscribe({
      next: (data) => {
        this.getNonActiveMembers = [...data];
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }

  makeActive(userid: number) {
    if (!confirm('Are you sure you want to make this user Active?')) {
      return;
    }

    this.errorMsg = '';
    this.showError = false;

    this.apiService
      .submitAccountStatus(userid, AccountStatus.Active, 'User was made Active again.')
      .subscribe({
        next: (data) => {
          this.loadNonActiveMembers();
        },
        error: (error) => {},
      });
  }

  // helpers
  formatDate(date: Date): string {
    return this.apiGlobalService.formatDate(date);
  }

  invalidDateRange(): boolean {
    this.errorMsg = 'Invalid date range';
    this.showError = this.apiGlobalService.invalidDateRange(this.startDate, this.endDate);
    return this.showError;
  }
}

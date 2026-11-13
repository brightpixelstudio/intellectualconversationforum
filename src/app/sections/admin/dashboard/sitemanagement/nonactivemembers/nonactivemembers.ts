import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiServiceAdmin } from '../../../../../services/adminservice';
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
  //  showSuccess = false;
  showError = false;
  errorMsg = '';

  constructor(
    private apiService: ApiServiceAdmin,
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
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  get invalidDateRange(): boolean {
    this.showError = false;
    this.errorMsg = 'Invalid date range';
    if (!this.startDate || !this.endDate) {
      this.showError = true;
      return true;
    }

    const start = new Date(`${this.startDate}T00:00:00`);
    const end = new Date(`${this.endDate}T00:00:00`);

    if (start > end) {
      this.showError = true;
      return true;
    }

    const oneYearLater = new Date(start);
    oneYearLater.setFullYear(oneYearLater.getFullYear() + 1);
    if (end > oneYearLater) {
      this.showError = true;
      return true;
    }
    return end > oneYearLater;
  }
}

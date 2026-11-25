import { Component, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceIdeas } from '../../services/ideaservice';
import { GlobalService } from '../../services/globalservice';
import { AuthService } from '../../services/auth';
import { IdeaType } from '../../enums/ideatype';
import { IdeaStatus } from '../../enums/ideastatus';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'ideas',
  imports: [FormsModule, DatePipe, JsonPipe],
  templateUrl: './ideas.html',
  styleUrl: './ideas.css',
})
export class Ideas {
  startDate = '';
  endDate = '';
  ideatypeid: number | undefined;
  ideastatusid: number | undefined;
  showSuccess = false;
  showError = false;
  errorMsg = '';

  constructor(
    private router: Router,
    private apiServiceIdeas: ApiServiceIdeas,
    private apiAuthService: AuthService,
    private apiGlobalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // set default dates
    const today = new Date();
    this.endDate = this.formatDate(today);
    const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    this.startDate = this.formatDate(firstDay);

    // create defaults
    this.ideatypeid = 0; // all
    this.ideastatusid = 0; // all

    // this.loadideas();
  }

  formatDate(date: Date): string {
    return this.apiGlobalService.formatDate(date);
  }

  invalidDateRange(): boolean {
    this.errorMsg = 'Invalid date range';
    this.showError = this.apiGlobalService.invalidDateRange(this.startDate, this.endDate);
    return this.showError;
  }
}

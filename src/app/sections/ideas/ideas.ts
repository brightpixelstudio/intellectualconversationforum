import { Component, ChangeDetectorRef, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiServiceIdeas } from '../../services/ideaservice';
import { GlobalService } from '../../services/globalservice';
import { AuthService } from '../../services/auth';
import { DatePipe, JsonPipe } from '@angular/common';
import { Router } from '@angular/router';
import { UserType } from '../../enums/usertype';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil } from '@fortawesome/free-solid-svg-icons';
import { IdeaStatus } from '../../enums/ideastatus';
import { FormIdeaUpdate } from '../../models/ideas/formideaupdate';

@Component({
  selector: 'ideas',
  imports: [FormsModule, FontAwesomeModule, DatePipe, JsonPipe],
  templateUrl: './ideas.html',
  styleUrl: './ideas.css',
})
export class Ideas {
  @Input({ required: true }) isAdmin!: boolean;

  loggedInUserGuid: string = '';
  getIdeas: any = {
    getIdeaStatuses: [],
    getIdeaTypes: [],
    getIdeas: [],
  };
  startDate = '';
  endDate = '';
  ideatypeid = 0; // allsmall
  ideastatusid = 0; // all
  title = '';
  description = '';
  response = '';
  selectedIdeaGuid = '';
  ideatypenewid = 1;
  IdeaStatus = IdeaStatus;
  ideastatusnewid = IdeaStatus.UnderReview;
  canUpdate = false;
  showSuccess = false;
  showError = false;
  showNew = false;
  showUpdate = false;
  errorMsg = '';
  successMsg = '';
  faPencil = faPencil;

  constructor(
    private router: Router,
    private apiServiceIdeas: ApiServiceIdeas,
    private apiAuthService: AuthService,
    private apiGlobalService: GlobalService,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.loggedInUserGuid = this.apiAuthService.getUserGuid() ?? '';

    // Set default dates
    const today = new Date();
    this.endDate = this.formatDate(today);

    const firstDay = new Date(today.getFullYear(), today.getMonth() - 3, 1);
    this.startDate = this.formatDate(firstDay);

    // Load the ideas
    this.loadIdeas();
  }

  loadIdeas(): void {
    const today = new Date();
    today.setDate(today.getDate() + 2);
    this.endDate = this.formatDate(today);

    this.apiServiceIdeas
      .getIdeas(this.ideastatusid, this.ideatypeid, this.startDate, this.endDate)
      .subscribe({
        next: (data) => {
          this.getIdeas = data;
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Unable to load ideas:', err);
        },
      });
  }

  insertIdea() {
    this.showSuccess = false;
    this.showError = false;
    this.apiServiceIdeas
      .insertIdea(this.loggedInUserGuid, this.ideatypenewid, this.title, this.description)
      .subscribe({
        next: (result) => {
          // reload
          this.title = '';
          this.description = '';
          this.showSuccess = true;
          this.successMsg = 'Your idea has been successfully submitted.';
          this.loadIdeas();
        },
        error: (error) => {
          this.showSuccess = true;
          this.showError = true;
          this.errorMsg = 'Error submitting idea';
        },
      });
  }

  updateIdea(): void {
    this.showSuccess = false;
    this.showError = false;

    const model: FormIdeaUpdate = {
      responseUserGuid: this.loggedInUserGuid,
      ideaGuid: this.selectedIdeaGuid,
      ideaStatusId: this.ideastatusnewid,
      response: this.response,
    };

    this.apiServiceIdeas.updateIdea(model).subscribe({
      next: (data) => {
        if (data.success) {
          this.response = '';
          this.showSuccess = true;
          this.successMsg = 'The idea has been successfully updated.';
          this.loadIdeas();
        }
      },
      error: (err) => {
        this.showError = true;
        this.errorMsg = 'Error updating idea';
      },
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

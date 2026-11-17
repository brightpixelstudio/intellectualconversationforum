import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { ApiServiceAnnouncment } from '../../../../../services/announcmentservice';
import { getannouncements } from '../../../../../models/announcement/getannouncments';
import { FormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faPencil, faHourglassEnd } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'announcements',
  imports: [DatePipe, FormsModule, FontAwesomeModule],
  templateUrl: './announcements.html',
  styleUrl: './announcements.css',
})
export class Announcements {
  title = '';
  announcement = '';
  dateexpired = '';
  announcementList!: getannouncements[];
  showSuccess = false;
  showError = false;
  errorMsg = '';
  faPencil = faPencil;
  faHourglassEnd = faHourglassEnd;

  constructor(
    private apiServiceAnnouncment: ApiServiceAnnouncment,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // set default date
    this.dateexpired = new Date().toISOString().split('T')[0];

    // load announcement
    this.loadannouncements();
  }

  private loadannouncements(): void {
    this.apiServiceAnnouncment.getAnnouncements().subscribe({
      next: (data) => {
        this.announcementList = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.cdr.detectChanges();
        console.error('One or more requests failed:', err);
      },
    });
  }
}

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
  announcementid = 0;
  title = '';
  announcement = '';
  dateexpire = '';
  announcementList!: getannouncements[];
  showSuccess = false;
  showError = false;
  errorMsg = '';
  successMsg = '';
  faPencil = faPencil;
  faHourglassEnd = faHourglassEnd;
  btText = 'Add Announcement';
  editMode: boolean = false;

  constructor(
    private apiServiceAnnouncment: ApiServiceAnnouncment,
    private cdr: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    // set default date
    const date = new Date();
    date.setDate(date.getDate() + 2);
    this.dateexpire = date.toISOString().split('T')[0];

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

  expireAnnouncement(announcementid: number): void {
    if (!confirm('Are you sure you want to expire this Announcement?')) {
      return;
    }

    this.showSuccess = false;
    this.showError = false;

    this.apiServiceAnnouncment.expireAnnouncement(announcementid).subscribe({
      next: (data) => {
        this.successMsg = 'This Announcement was expired';
        this.showSuccess = true;
        this.showError = false;
        this.loadannouncements();
        this.cdr.detectChanges();
      },
      error: (err) => {
        this.showSuccess = false;
        this.showError = true;
        this.cdr.detectChanges();
        this.errorMsg = err;
      },
    });
  }

  addUpdateAnnouncement() {
    this.showSuccess = false;
    this.showError = false;

    if (
      !this.title.trim() ||
      this.title.trim().length < 10 ||
      !this.announcement.trim() ||
      this.announcement.trim().length < 10
    ) {
      return;
    }

    // are we adding or updating (create correct API call)
    const apiCall = this.editMode
      ? this.apiServiceAnnouncment.submitUpdateAnnouncement(
          this.announcementid,
          this.title,
          this.announcement,
          new Date(this.dateexpire),
        )
      : this.apiServiceAnnouncment.submitAddAnnouncement(
          this.announcementid,
          this.title,
          this.announcement,
          new Date(this.dateexpire),
        );

    apiCall.subscribe({
      next: (data) => {
        if (this.editMode) {
          this.successMsg = 'This Announcement was updated';
        } else {
          this.successMsg = 'This Announcement was added';
          this.cancelEdit();
        }
        this.showSuccess = true;
        this.showError = false;
        this.loadannouncements();
        this.cdr.detectChanges();
      },
      error: (err) => {
        if (this.editMode) {
          this.errorMsg = 'There was an error updating the Announcement record';
        } else {
          this.errorMsg = 'There was an error inserting the Announcement record';
        }
        this.showSuccess = false;
        this.showError = true;
        this.cdr.detectChanges();
      },
    });
  }

  // helpers
  updateAnnouncement(announcementid: number) {
    // get the record
    const announcement = this.announcementList.find((a) => a.announcementid === announcementid);
    if (!announcement) return;

    // fill in the fields
    this.announcementid = announcement.announcementid;
    this.title = announcement.title;
    this.announcement = announcement.announcement;
    this.dateexpire = new Date(announcement.dateexpire).toISOString().split('T')[0];

    // change button text
    this.editMode = true;
    this.btText = 'Update Announcement';
  }

  cancelEdit() {
    this.showSuccess = false;
    this.showError = false;

    // clear the fields
    this.announcementid = 0;
    this.title = '';
    this.announcement = '';

    const date = new Date();
    date.setDate(date.getDate() + 2);
    this.dateexpire = date.toISOString().split('T')[0];

    this.editMode = false;
    this.btText = 'Add Announcement';
  }
}

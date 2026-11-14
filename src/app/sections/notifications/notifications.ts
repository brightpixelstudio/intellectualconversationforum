import { Component, ChangeDetectorRef, EventEmitter, OnInit, Output, inject } from '@angular/core';
import { ApiServiceNotifications } from '../../services/notificationservice';
import { NotificationModel } from '../../models/notifications/notificationmodel';
import { DatePipe, JsonPipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { GlobalService } from '../../services/globalservice';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { finalize } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [DatePipe, JsonPipe, FontAwesomeModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class NotificationsComponent implements OnInit {
  @Output() notificationSelected = new EventEmitter<NotificationModel>();

  private cdr = inject(ChangeDetectorRef);
  notifications: NotificationModel[] = [];
  unreadCount = 0;
  faBell = faBell;

  loading = false;
  errorMessage = '';

  constructor(
    private notificationService: ApiServiceNotifications,
    private apiServiceGlobal: GlobalService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.notificationService
      .getNotifications()
      .pipe(
        finalize(() => {
          this.loading = false;
          this.cdr.detectChanges();
        }),
      )
      .subscribe({
        next: (data) => {
          this.notifications = data;

          this.unreadCount = data.filter((notification) => !notification.isRead).length;
        },
        error: (error) => {
          console.error('Error loading notifications:', error);
          this.errorMessage = 'Unable to load notifications.';
        },
      });
  }

  loadUnreadCount(): void {
    this.notificationService.getUnreadNotificationCount().subscribe({
      next: (count) => {
        this.unreadCount = count;
      },
    });
  }

  selectNotification(notification: NotificationModel): void {
    const navigateToPost = () => {
      this.router.navigate(['/post'], {
        queryParams: {
          postguid: notification.postGuid,
          postcommentid: notification.postCommentId,
        },
      });
    };

    if (!notification.isRead) {
      this.notificationService.markNotificationRead(notification.notificationId).subscribe({
        next: () => {
          notification.isRead = true;
          notification.dateRead = new Date();

          this.loadUnreadCount();

          navigateToPost();
        },
        error: () => {
          navigateToPost();
        },
      });
    } else {
      navigateToPost();
    }

    this.notificationSelected.emit(notification);
  }
  markAllAsRead(): void {
    if (this.unreadCount === 0) {
      return;
    }

    this.notificationService.markAllNotificationsRead().subscribe({
      next: () => {
        this.notifications.forEach((notification) => {
          notification.isRead = true;
          notification.dateRead = new Date();
        });

        this.unreadCount = 0;
      },
    });
  }

  getTimeAgo(date: string | Date): string {
    return this.apiServiceGlobal.getTimeAgo(date);
  }
}

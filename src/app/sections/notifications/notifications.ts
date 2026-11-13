import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { ApiServiceNotifications } from '../../services/notificationservice';
import { NotificationModel } from '../../models/notifications/notificationmodel';
import { DatePipe } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faBell } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'notifications',
  standalone: true,
  imports: [DatePipe, FontAwesomeModule],
  templateUrl: './notifications.html',
  styleUrl: './notifications.css',
})
export class NotificationsComponent implements OnInit {
  @Output() notificationSelected = new EventEmitter<NotificationModel>();

  notifications: NotificationModel[] = [];
  unreadCount = 0;
  faBell = faBell;

  loading = false;
  errorMessage = '';

  constructor(private notificationService: ApiServiceNotifications) {}

  ngOnInit(): void {
    this.loadNotifications();
  }

  loadNotifications(): void {
    this.loading = true;
    this.errorMessage = '';

    this.notificationService.getNotifications(20, 0).subscribe({
      next: (data) => {
        this.notifications = data;
        this.loading = false;
        this.loadUnreadCount();
      },
      error: () => {
        this.loading = false;
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
    if (!notification.isRead) {
      this.notificationService.markNotificationRead(notification.notificationId).subscribe({
        next: () => {
          notification.isRead = true;
          notification.dateRead = new Date();
          this.loadUnreadCount();
        },
      });
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
}

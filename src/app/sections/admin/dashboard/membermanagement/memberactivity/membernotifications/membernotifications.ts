import { Component, Input } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { GlobalService } from '../../../../../../services/globalservice';
import { NotificationModel } from '../../../../../../models/notifications/notificationmodel';
import { Router } from '@angular/router';

@Component({
  selector: 'membernotifications',
  imports: [JsonPipe],
  templateUrl: './membernotifications.html',
  styleUrl: './membernotifications.css',
})
export class MemberNotifications {
  @Input() notifications: NotificationModel[] = [];
  @Input() canUpdate = false;

  constructor(
    private apiServiceGlobal: GlobalService,
    private router: Router,
  ) {}

  getTimeAgo(date: string | Date): string {
    return this.apiServiceGlobal.getTimeAgo(date);
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

    /*
    // Are they the actual user?  NOT the admin
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
    */

    navigateToPost();

    //    this.notificationSelected.emit(notification);
  }
}

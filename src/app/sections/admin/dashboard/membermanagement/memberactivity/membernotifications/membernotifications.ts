import { Component, Input } from '@angular/core';
import { JsonPipe } from '@angular/common';
import { GlobalService } from '../../../../../../services/globalservice';
import { ApiServiceNotifications } from '../../../../../../services/notificationservice';
import { NotificationModel } from '../../../../../../models/notifications/notificationmodel';
import { Router } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'membernotifications',
  imports: [JsonPipe, FontAwesomeModule],
  templateUrl: './membernotifications.html',
  styleUrl: './membernotifications.css',
})
export class MemberNotifications {
  @Input() notifications: NotificationModel[] = [];
  @Input() isAdmin = false;
  @Input() canUpdate = false;

  faCheck = faCheck;

  constructor(
    private apiServiceGlobal: GlobalService,
    private notificationService: ApiServiceNotifications,
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

    // Are they the actual user?
    if (!notification.isRead && this.canUpdate) {
      this.notificationService.markNotificationRead(notification.notificationId).subscribe({
        next: () => {
          notification.isRead = true;
          notification.dateRead = new Date();

          navigateToPost();
        },
        error: () => {
          navigateToPost();
        },
      });
    } else {
      navigateToPost();
    }
  }
}

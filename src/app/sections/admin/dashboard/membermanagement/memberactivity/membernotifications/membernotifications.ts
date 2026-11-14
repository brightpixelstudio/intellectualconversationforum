import { Component, Input } from '@angular/core';
import { DatePipe, JsonPipe } from '@angular/common';
import { GlobalService } from '../../../../../../services/globalservice';
import { NotificationModel } from '../../../../../../models/notifications/notificationmodel';

@Component({
  selector: 'membernotifications',
  imports: [JsonPipe],
  templateUrl: './membernotifications.html',
  styleUrl: './membernotifications.css',
})
export class MemberNotifications {
  @Input() notifications: NotificationModel[] = [];

  constructor(private apiServiceGlobal: GlobalService) {}

  getTimeAgo(date: string | Date): string {
    return this.apiServiceGlobal.getTimeAgo(date);
  }
}

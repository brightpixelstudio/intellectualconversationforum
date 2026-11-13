export interface NotificationModel {
  notificationId: number;
  recipientUserId: number;
  actorUserId: number;
  actorUsername: string;
  postId: number;
  postGuid: string;
  postCommentId: number;
  isRead: boolean;
  dateCreated: Date;
  dateRead: Date | null;
}

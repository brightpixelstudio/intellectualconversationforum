export interface NotificationModel {
  notificationId: number;
  recipientUserId: number;
  actorUserId: number;
  actorUsername: string;
  actorName: string;
  actorGuid: string;
  postShortText: string;
  postId: number;
  postGuid: string;
  postCommentId: number;
  reportedId: number | null;
  isRead: boolean;
  dateCreated: Date;
  dateRead: Date | null;
  ProfileImageKey: string | null;
  profileImageUrl: string | null;
}

export interface GetIdea {
  ideaGuid: string;
  title: string;
  description: string;
  ideaTypeId: number;
  ideaType: string;
  ideaStatusId: number;
  ideaStatus: string;
  userId: number;
  userGuid: string;
  username: string;
  name: string | null;
  profileImageKey: string | null;
  profileimageurl: string | null;
  response: string | null;
  dateAdded: Date;
  dateUpdated: Date | null;
}

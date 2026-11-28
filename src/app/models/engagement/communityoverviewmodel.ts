export interface CommunityOverviewRequest {
  startDate: string;
  endDate: string;
}

export interface CommunityOverviewModel {
  totalMembers: number;
  newMembers: number;
  activeMembers: number;
  membersCommenting: number;
  totalPosts: number;
  totalComments: number;
}

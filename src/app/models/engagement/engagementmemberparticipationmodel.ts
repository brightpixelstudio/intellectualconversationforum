export interface EngagementMemberParticipationResponse {
  summary: MemberParticipationSummary;
  mostActiveMembers: MemberParticipationActivity[];
  participationPatterns: MemberParticipationPattern[];
  memberRetention: MemberParticipationRetention[];
}

export interface MemberParticipationSummary {
  totalMembers: number;
  activeMembers: number;
  membersWhoPosted: number;
  membersWhoCommented: number;
  postOnlyMembers: number;
  commentOnlyMembers: number;
  neverParticipatedMembers: number;
  inactiveMembers: number;
  totalPosts: number;
  totalComments: number;
}

export interface MemberParticipationActivity {
  userId: number;
  guid: string;
  username: string;
  name: string;
  profileImageKey: string | null;
  zipcode: number;
  city: string | null;
  state: string | null;
  postsInRange: number;
  commentsInRange: number;
  totalContributions: number;
  lifetimePosts: number;
  lifetimeComments: number;
  lastActivityDate: string | null;
  profileImageUrl: string | null;
}

export interface MemberParticipationPattern {
  userId: number;
  guid: string;
  username: string;
  name: string;
  profileImageKey: string | null;
  zipcode: number;
  city: string | null;
  state: string | null;
  participationType: string;
  postsInRange: number;
  commentsInRange: number;
  lifetimePosts: number;
  lifetimeComments: number;
  lastActivityDate: string | null;
  profileImageUrl: string | null;
}

export interface MemberParticipationRetention {
  userId: number;
  guid: string;
  username: string;
  name: string;
  profileImageKey: string | null;
  zipcode: number;
  city: string | null;
  state: string | null;
  dateAdded: string;
  retentionType: string;
  lifetimePosts: number;
  lifetimeComments: number;
  lastActivityDate: string | null;
  profileImageUrl: string | null;
}

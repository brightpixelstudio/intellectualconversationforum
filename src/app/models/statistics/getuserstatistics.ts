export interface GetUserStatistics {
  userId: number;
  userGuid: string;
  averagePostRating: number;
  averageCommentRating: number;
  totalPostsRated: number;
  totalCommentsRated: number;
  totalPosts: number;
  totalComments: number;
}

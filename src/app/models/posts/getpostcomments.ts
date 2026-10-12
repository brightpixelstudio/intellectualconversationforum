export interface GetPostComments {
  postcommentid: number;
  postid: number;
  userid: number;
  name: string;
  username: string;
  dateadded: Date;
  catagory: string;
  rating: number;
  comment: string;
}

export interface GetPostComments {
  postcommentid: number;
  postid: number;
  userid: number;
  commentguid: string;
  postguid: string;
  userguid: string;
  name: string;
  username: string;
  dateadded: Date;
  catagory: string;
  rating: number;
  successrating: boolean;
  comment: string;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

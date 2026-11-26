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
  ratingcount: number;
  userrating: number | null;
  successrating: boolean;
  comment: string;
  usertypeid: number;
  city: string;
  state: string;
  zipcode: number;
  type: string;
  commentprofileimagekey: string | null;
  commentprofileimageurl: string | null;
}

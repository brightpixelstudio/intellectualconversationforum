export interface GetPost {
  postid: number;
  post: string;
  userid: number;
  userguid: string;
  name: string;
  username: string;
  postcatagoryid: number;
  catagory: string;
  count: number;
  rating: number;
  ratingcount: number;
  userrating: number | null;
  dateadded: Date;
  successrating: boolean;
  commentsclosed: number;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

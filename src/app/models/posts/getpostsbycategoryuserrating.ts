export interface GetPostsByCategoryUserRating {
  postid: number;
  userid: number;
  postguid: string;
  userguid: string;
  username: string;
  name: string;
  profileimagekey: string | null;
  profileimageurl: string | null;
  postcatagoruid: string;
  catagory: string;
  dateadded: Date;
  count: number;
  post: string;
  comments: string;
  rating: number;
  ratingcount: number;
  successrating: boolean;
  commentsclosed: number;
}

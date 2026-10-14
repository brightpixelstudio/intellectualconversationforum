export interface GetPostsByCategoryUserRating {
  postid: number;
  userid: number;
  postguid: string;
  userguid: string;
  username: string;
  name: string;
  postcatagoruid: string;
  catagory: string;
  dateadded: Date;
  count: number;
  post: string;
  comments: string;
  rating: number;
  successrating: boolean;
  commentsclosed: number;
}

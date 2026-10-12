export interface GetPostsByCategoryUserRating {
  postid: number;
  userid: number;
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
}

import { PostImage } from './postimage';

export interface GetPostsByCategoryUserRating {
  postid: number;
  userid: number;
  postguid: string;
  userguid: string;
  username: string;
  name: string;
  profileimagekey: string | null;
  profileimageurl: string | null;
  postcatagoryid: number;
  catagory: string;
  dateadded: Date;
  count: number;
  post: string;
  rating: number;
  ratingcount: number;
  userrating: number | null;
  commentsclosed: number;
  usertypeid: number;
  type: string;

  postimages: PostImage[];
  successrating: boolean;
}

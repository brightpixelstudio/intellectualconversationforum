import { PostImage } from './postimage';

export interface GetPost {
  postid: number;
  post: string;
  postguid: string;
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
  ispinned: boolean;
  city: string;
  state: string;
  type: string;
  commentsclosed: number;
  profileimagekey: string | null;
  profileimageurl: string | null;
  postimages: PostImage[];
}

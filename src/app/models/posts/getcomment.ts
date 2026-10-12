export interface GetComment {
  postcommentid: number;
  postid: number;
  userid: number;
  comment: string;
  dateadded: Date;
  name: string;
  catagory: string;
  rating: number;
}

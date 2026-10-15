export interface GetComment {
  postcommentid: number;
  postid: number;
  userid: number;
  userguid: string;
  comment: string;
  dateadded: Date;
  name: string;
  catagory: string;
  rating: number;
  timePassed: string;
}

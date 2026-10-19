export interface GetPostsMember {
  postid: number;
  postguid: string;
  userid: number;
  userguid: string;
  name: string;
  postcatagoryid: number;
  catagory: string;
  dateadded: Date;
  count: number;
  shorttext: string;
  rating: number;
  commentsclosed: number;
}

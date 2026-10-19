export interface GetCommentsMember {
  postid: number;
  postguid: string;
  userid: number;
  userguid: string;
  name: string;
  postcatagoryid: number;
  postcommentid: number;
  postshorttext: string;
  commentshorttext: string;
  dateadded: Date;
  commentsclosed: number;
}

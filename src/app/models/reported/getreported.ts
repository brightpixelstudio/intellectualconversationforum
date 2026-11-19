export interface GetReported {
  reportedid: number;
  reportedstatusid: number;
  reporteduserguid: string | null;
  postid: number | null;
  postcommentid: number | null;
  reportedcontent: string;
  reason: string;
  response: string | null;
  dateadded: Date | null;
  dateresponded: Date | null;
  respondeduserid: number | null;
}

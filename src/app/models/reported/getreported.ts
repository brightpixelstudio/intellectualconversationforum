export interface GetReported {
  reportedid: number | 0;
  reportedstatusid: number;
  reportedusername: string | null;
  reporteduserguid: string | null;
  statusname: string;
  postid: number | null;
  postguid: string | null;
  postcommentid: number | null;
  reportedcontent: string;
  reason: string;
  response: string | null;
  dateadded: Date | null;
  dateresponded: Date | null;
  respondeduserid: number | null;
  respondedusername: string | null;
  respondeduserguid: string | null;
}

export interface GetNonActiveMembers {
  userid: number;
  userguid: string;
  accountstatusid: number;
  username: string;
  accountstatus: string;
  datechanged: Date;
  changedbyuserid: number;
  reason: string;
  changedbyname: string;
}

export interface GetNewestMembers {
  userid: number;
  userguid: string;
  username: string;
  email: string;
  name: string;
  zipcode: number;
  usertypeid: number;
  type: string;
  accountstatusid: number;
  accountstatus: string;
  dateadded: Date;
  datelastlogin: Date;
  count: number;
  profile: string;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

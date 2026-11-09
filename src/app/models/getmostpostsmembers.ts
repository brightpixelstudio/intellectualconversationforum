export interface GetMostPostsMembers {
  userid: number;
  userguid: string;
  name: string;
  username: string;
  email: string;
  zipcode: number;
  profile: string;
  dateadded: Date;
  datelastlogin: Date;
  count: number;
  accountstatusid: number;
  accountstatus: string;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

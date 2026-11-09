export interface GetProfileMember {
  userid: number;
  usertypeid: number;
  type: string;
  accountstatusid: number;
  accountstatus: string;
  name: string;
  username: string;
  email: string;
  zipcode: number;
  count: number;
  profile: string;
  datelastpost: Date | null;
  datelastlogin: Date;
  dateadded: Date;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

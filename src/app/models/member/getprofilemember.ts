export interface GetProfileMember {
  userid: number;
  guid: string;
  usertypeid: number;
  type: string;
  accountstatusid: number;
  accountstatus: string;
  name: string;
  username: string;
  email: string;
  zipcode: number;
  city: string;
  state: string;
  count: number;
  profile: string;
  datelastpost: Date | null;
  datelastlogin: Date;
  dateadded: Date;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

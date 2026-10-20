export interface GetNewestMembers {
  userid: number;
  userguid: string;
  usertypeid: number;
  type: string;
  name: string;
  username: string;
  email: string;
  password: string;
  zipcode: number;
  count: number;
  profile: string;
  datelastpost: Date;
  datelastlogin: Date;
  dateadded: Date;
  blocked: boolean;
  profileimagekey: string | null;
  profileimageurl: string | null;
}

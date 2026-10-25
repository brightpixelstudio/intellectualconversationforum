export interface GetProfileMember {
  userid: number;
  usertypeid: number;
  type: string;
  name: string;
  username: string;
  email: string;
  zipcode: number;
  count: number;
  profile: string;
  datelastpost: Date;
  datelastlogin: Date;
  dateadded: Date;
  blocked: boolean;
  profileImageKey: string | null;
  profileImage: string | null;
  profileimageurl: string | null;
}

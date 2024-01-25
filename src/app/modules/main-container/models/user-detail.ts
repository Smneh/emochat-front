export class UserDetail {
  username: string;
  fullName: string;
  idNumber: string;
  mobile: string;
  tel: string;
  address: string;
  isMale: boolean;
  email: string;
  lastModifyDate: number;
  profilePictureId: string;

  constructor() {
    this.username = '';
    this.fullName = '';
    this.idNumber = '-';
    this.mobile = '';
    this.tel = '';
    this.address = '';
    this.isMale = true;
    this.email = '';
    this.lastModifyDate = 0;
    this.profilePictureId = '-';
  }
}

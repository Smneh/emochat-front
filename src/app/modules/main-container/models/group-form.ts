export class GroupForm {
  groupId: string;
  title: string;
  description: string;
  profilePictureId: string;
  members:string[];

  constructor() {
    this.groupId = '';
    this.title = '';
    this.description = '';
    this.profilePictureId = '-';
    this.members = [];
  }
}

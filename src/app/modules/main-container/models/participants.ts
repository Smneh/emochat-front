export class Participants {
  id: number;
  receiverId: string;
  type: string;
  fullname: string;
  username: string;
  title: string;
  description: string;
  onlineStatus: string;
  creator: string;
  profilePictureId: string;
  messageCount: number;
  isSelf: number;
  isPrivate: boolean;
  isCreator: boolean;
  isAdmin: boolean;
  icon: string;
  groupId: string;
  unReadMessages:  number[];
  lastActionTime: string;
  firstUnreadMessageId: number;

  constructor() {
    this.id = 0;
    this.receiverId = '-';
    this.type = '-';
    this.fullname = '-';
    this.onlineStatus = '-';
    this.username = '-';
    this.description = '-';
    this.creator = '-';
    this.profilePictureId = '-';
    this.messageCount = 0;
    this.isSelf = 0;
    this.isPrivate = false;
    this.isCreator = false;
    this.isAdmin = false;
    this.groupId = '';
    this.title = '';
    this.unReadMessages = [];
    this.firstUnreadMessageId = 0;
  }
}

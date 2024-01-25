import {Component, Input} from '@angular/core';
import {NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {SecurityService} from 'src/app/shared/services/security.service';
import {UserService} from 'src/app/shared/services/user.service';
import {ChatRowRecord} from '../../models/conversation-record';
import {ConversationService} from '../../services/conversation.service';
import {SharedService} from '../../services/groups.service';

@Component({
  selector: 'conversation-record',
  templateUrl: './conversation-record.html',
  styleUrls: ['./conversation-record.scss', './responsive.scss'],
})
export class ConversationRecord {

  constructor(
    private securityService: SecurityService,
    public chatListService: ConversationService,
    public sharedService: SharedService,
    public userService: UserService,
  ) {
  }

  chatRecord: ChatRowRecord = new ChatRowRecord();
  username = this.securityService.GetUsername();
  window = window;
  time = '';

  @Input() set data(val) {
    this.chatRecord = val;
    this.chatRecord.content = unescape(this.chatRecord.content);

    if (this.chatRecord.content.length > 40)
      this.chatRecord.content = this.chatRecord.content.substring(0, 40) + '...';
    this.setUnreadCount();
    this.chatRecord.content = this.chatRecord.content.substring(0, 48);
  }

  setUnreadCount() {
    if (this.chatRecord.unReadMessages)
      this.chatRecord.unreadCount = this.chatRecord.unReadMessages.length;
  }

  modalRef: NgbModalRef;
}

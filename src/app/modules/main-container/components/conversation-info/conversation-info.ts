import {ConversationService} from '../../services/conversation.service';
import {SecurityService} from '../../../../shared/services/security.service';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {ConfigsService} from 'src/app/shared/services/configs.service';
import {SharedService} from '../../services/groups.service';
import {ConversationInfoModal} from '../conversation-info-modal/conversation-info-modal.component';
import {OnlineUsersService} from 'src/app/shared/services/online-users.service';
import {UserInfoModal} from "../user-info-modal/user-info-modal";

@Component({
  selector: 'conversation-info',
  templateUrl: './conversation-info.html',
  styleUrls: ['./conversation-info.scss']
})
export class ConversationInfo implements OnInit {
  isOpen: boolean = false;
  modalRef: NgbModalRef
  @Input() set chatTitle(val: string) {
    if (!val) return;
    if (val.length > 40) {
      this.groupInfoTitle = val.substring(0, 35) + '...'
    }
    else {
      this.groupInfoTitle = val
    }
  }
  @Input() closable: boolean = false;
  @Input() emptyHeader: boolean = false;
  @Input() isMiniChat: boolean = false;
  @Input() isProjectTask: boolean = false;


  @Output() closedModal = new EventEmitter()
  username
  window = window;
  groupInfoTitle: string = '';
  constructor(
    private modalService: NgbModal,
    public configurationService: ConfigsService,
    private chatListService: ConversationService,
    private securityService: SecurityService,
    public sharedService: SharedService,
    public onlineUsersService: OnlineUsersService
  ) {
    this.username = this.securityService.GetUsername();
  }

  ngOnInit(): void {
  }

  openGroupInfo(groupInfo) {
    if (groupInfo.type != "User") {
      this.modalRef = this.modalService.open(ConversationInfoModal, { size: 'md', centered: true, animation: false })
      if (groupInfo.type == undefined)
        this.modalRef.componentInstance.groupType = 'Group';
      else
        this.modalRef.componentInstance.groupType = groupInfo.type
      this.modalRef.componentInstance.groupReceiverId = groupInfo.groupId
      this.modalRef.componentInstance.editGroupInfo.subscribe(event => {
        this.sharedService.groupInfo.profilePictureId = event.ppId;
        this.sharedService.groupInfo.title = event.title;
        let index = this.chatListService.chatFeeds.findIndex(x => x.receiverId == groupInfo.receiverId);
        if (index > -1) {
          this.chatListService.chatFeeds[index].title = event.title;
          this.chatListService.chatFeeds[index].profilePictureId = event.ppId;
        }
      })
    } else {
      this.modalRef = this.modalService.open(UserInfoModal, { size: 'md', centered: true, animation: false })
      this.modalRef.componentInstance.username = groupInfo.receiverId
    }
  }

  searchChat() {
  }

  openSearch() {
    if (!this.sharedService.isShowSearchHeader) {
      this.sharedService.isShowSearchHeader = true;
    } else {
      this.sharedService.isShowSearchHeader = false;
    }
  }
}

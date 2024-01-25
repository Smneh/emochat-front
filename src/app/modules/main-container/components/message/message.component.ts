import {ModalDismissReasons, NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {Component, ElementRef, EventEmitter, Input, OnInit, Output, Pipe, ViewChild,} from '@angular/core';
import {DateService} from 'src/app/shared/services/date.service';
import {SecurityService} from 'src/app/shared/services/security.service';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';
import {MessageRecord} from '../../models/message-record';
import {MessagesDataRepositoryService} from '../../services/repositories/messages-data-repository.service';
import {SharedService} from '../../services/groups.service';
import {VisitorsElement} from '../visitors-element/visitors-element.component';
import {ConversationService} from "../../services/conversation.service";
import {AppUsers} from "../app-users/app-users.component";

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.scss', './responsive.scss'],
})
export class Message implements OnInit {
  @Input() isMiniChat: boolean = false;
  contextMenuOpen: boolean = false;
  @Output() navigateToMessage = new EventEmitter();
  @Pipe({ name: 'linkify' })
  onHover = false;
  window = window;
  username = '';
  date = '';
  previousMessageIsSelf = false;
  previousMessageIsToday = false;
  nextMessageIsToday = false;
  nextMessageHasSameRegUser = false;
  isSelf = false;
  timer = null;
  modalRef: NgbModalRef;
  deleteMessageModalRef: NgbModalRef;
  @ViewChild('deleteMessageModal') confirmDeleteMessageModal;
  optionsDisabledList = new Map<string, [any]>();

  constructor(
    public securityService: SecurityService,
    private SnackbarMessageService: SnackbarMessageService,
    public dateService: DateService,
    public sharedService: SharedService,
    private messagesRepositoryService: MessagesDataRepositoryService,
    private element: ElementRef,
    private modalService: NgbModal,
    public chatListService: ConversationService,
  ) {
    this.optionsDisabledList.set('delete', [6]);
    this.username = this.securityService.GetUsername();
  }

  ngOnInit(): void {
    this.checkPreviousMessageIsSelf();
    this.checkPreviousMessageIsToday();
    this.checkNextMessageIsToday();
    this.checkNextMessageHasSameRegUser();
  }

  item: MessageRecord = new MessageRecord();
  parentMessage = null;

  @Input() index = 0;
  @Input() totalMessagesIndex = 0;
  @Input() set data(value: MessageRecord) {
    this.item = value;
    this.item.element = this.element;
    this.item.itemId = 'groupRow' + this.item.messageId;
    this.isSelf = this.item.isSelf;
    this.showReplayMsg();
    this.getDate();
  }

  onContextMenu(event: MouseEvent): void {
    event.preventDefault();
    this.contextMenuOpen = true;
  }

  onMouseLeave(): void {
    this.contextMenuOpen = false;
  }

  showReplayMsg() {
      if (this.item.parentId > 0) {
        if (this.sharedService.replayMessageContent) {
          this.parentMessage = this.sharedService.replayMessageContent;
        }
        else {
          this.parentMessage = this.item.replyMessage
        }
      }
  }

  getDate() {
    this.date = this.dateService.formatMonthAndDay(this.item.regDate);
  }

  deleteMessage(msg) {
    this.sharedService.selectedMessageForDelete = msg;
    this.openDeleteDialog(this.confirmDeleteMessageModal, this.sharedService.selectedMessageForDelete);
  }

  openDeleteDialog(content, message) {
    if (this.window.screen.width <= 1024) {
      this.deleteMessageModalRef = this.modalService.open(content, { animation: false });
    } else {
      this.deleteMessageModalRef = this.modalService.open(content, { windowClass: 'modal-custom-position', size: "sm" });
    }
    this.deleteMessageModalRef.dismissed.subscribe(
      (reason) => {
        if (reason === ModalDismissReasons.ESC || reason === ModalDismissReasons.BACKDROP_CLICK) {
          this.item.isObsolete = false;
        }
      },
    );
  }

  deleteConfirmed() {
    if (this.sharedService.selectedMessageForDelete) {
      this.delete(this.sharedService.selectedMessageForDelete);
    }
  }

  delete(msg: MessageRecord) {
    this.messagesRepositoryService.delete(msg.receiverId, msg.messageId).subscribe(() => {
      let index = this.sharedService.messages.findIndex(x => x.messageId == msg.messageId)
      this.sharedService.messages.splice(index, 1);
      this.item.isObsolete = true;
      this.chatListService.getChatList();
      this.deleteMessageModalRef.close();
    })
  }

  closeModal(modal) {
    this.item.isObsolete = false;
    modal.dismiss();
  }

  copyMessage(msg: MessageRecord) {
    msg.content = this.removeTags(msg.content);
    msg.content = unescape(msg.content);

    // Check if the navigator.clipboard is supported
    if (navigator.clipboard) {
      navigator.clipboard
        .writeText(msg.content)
        .then(() => {
          this.SnackbarMessageService.success('Copied');
        })
        .catch((e) => {
          this.SnackbarMessageService.error('Failed');
        });
    } else {
      this.SnackbarMessageService.error('Clipboard API not supported');
    }
  }

  removeTags(str) {
    if (str === null || str === '') return false;
    else str = str.toString();
    return str.replace(/(<([^>]+)>)/gi, '');
  }

  checkPreviousMessageIsSelf() {
    if (this.index == 0) {
      this.previousMessageIsSelf = false;
      return;
    }
    if (this.item.regUser == this.sharedService.totalMessages[this.totalMessagesIndex][this.index - 1].regUser) {
      this.previousMessageIsSelf = true;
      return;
    } else {
      this.previousMessageIsSelf = false;
    }
  }

  checkPreviousMessageIsToday() {
    if (this.index == 0) {
      this.previousMessageIsToday = false;
      return;
    }
    const date1 = new Date(this.item.regDate);
    const date2 = new Date(this.sharedService.totalMessages[this.totalMessagesIndex][this.index - 1].regDate);
    if (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    ) {
      this.previousMessageIsToday = true;
    } else {
      this.previousMessageIsToday = false;
    }
  }

  checkNextMessageIsToday() {
    const totalMessages = this.sharedService.totalMessages[this.totalMessagesIndex];

    if (this.index === totalMessages.length - 1) {
      this.nextMessageIsToday = false;
      return;
    }

    if (
      this.item.regDate.toString().substring(0, 10) ===
      totalMessages[this.index + 1].regDate.toString().substring(0, 10)
    ) {
      this.nextMessageIsToday = true;
    } else {
      this.nextMessageIsToday = false;
    }
  }

  checkNextMessageHasSameRegUser() {
    const totalMessages = this.sharedService.totalMessages[this.totalMessagesIndex];

    if (this.index === totalMessages.length - 1) {
      this.nextMessageHasSameRegUser = false;
      return;
    }

    if (
      this.item.regUser === totalMessages[this.index + 1].regUser
    ) {
      this.nextMessageHasSameRegUser = true;
    } else {
      this.nextMessageHasSameRegUser = false;
    }
  }


  replayMessage(msg: MessageRecord) {
    this.sharedService.replay = msg;
    this.sharedService.scrollToEnd();
  }

  select(msg: MessageRecord) {
    this.sharedService.handleGroupMessageSelect(this.item);//TODO
  }

  forward(msg: MessageRecord) {
    this.modalRef = this.modalService.open(AppUsers, {
      size: 'md',
      centered: true,
      animation: false,
      windowClass:'custom-height'
    });
    this.modalRef.componentInstance.title = 'Forward to ...';
    this.modalRef.componentInstance.selectUser.subscribe((selectedUser) => {
      let users: string[] = [selectedUser.username];
      this.sharedService.forwardMessages(users);
      this.modalRef.close();
    });
  }

  selectMessage() {
    this.sharedService.handleGroupMessageSelect(this.item);
  }

  navigateToMessages(message: any) {
    this.navigateToMessage.emit(message.messageId);
  }

  openVisitLog() {
    this.modalRef = this.modalService.open(VisitorsElement, {
      size: 'sm',
      centered: true,
    });

    if (!this.item.visitors.length) {
      this.item.visitors = [];
    }
    this.modalRef.componentInstance.visitorList = this.item.visitors;
  }
}

import {Component, ElementRef, Input, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {SharedService} from '../../services/groups.service';
import {NgbActiveModal, NgbModalRef} from "@ng-bootstrap/ng-bootstrap";
import {Subscription} from "rxjs";
import {SecurityService} from "../../../../shared/services/security.service";
import {UploadService} from "../../../../shared/services/upload.service";
import {ConversationService} from "../../services/conversation.service";
import {MessagesApiService} from "../../services/messages.api.service";
import {ActivatedRoute} from "@angular/router";
import {Title} from "@angular/platform-browser";
import {SnackbarMessageService} from "../../../../shared/services/snackbar-message.service";
import {MessagesDataRepositoryService} from "../../services/repositories/messages-data-repository.service";
import {UserService} from "../../../../shared/services/user.service";
import {MessageRecord} from "../../models/message-record";

@Component({
  selector: 'messages-list',
  templateUrl: './messages-list.html',
  styleUrls: ['./messages-list.scss'],
  providers: [NgbActiveModal]
})
export class MessageListComponent implements OnInit, OnDestroy  {
  @Input() chatTitle = "-";
  @Input() closable: boolean = false;
  @ViewChild('messagesBody') messagesBody: any;
  currentChatReceiver: string = '';
  messageReceiver: string = '';
  modalRef: NgbModalRef
  window = window;
  showScrollDownBtn = false;
  subscrptions: Subscription[] = [];
  toastSubscription: Subscription;
  currentMessageContainer: HTMLElement;
  constructor(
    public securityService: SecurityService,
    public uploadService: UploadService,
    public sharedService: SharedService,
    private chatListService: ConversationService,
    private apiService: MessagesApiService,
    private route: ActivatedRoute,
    private title: Title,
    private SnackbarMessageService: SnackbarMessageService,
    private messagesRepositoryService: MessagesDataRepositoryService,
    private elementRef: ElementRef,
    public userService: UserService,

  ) {
    this.sharedService.activeMessageId.subscribe(res => {
      if (res) {
        this.navigateToMessage(res)
      }
    });
  }

  ngOnInit(): void {
    this.sharedService.isFirstLoading = true;
    this.resetData();
    this.sharedService.currentChatReceiver$.subscribe((receiver) => {
      this.sharedService.isFirstLoading = true;
      this.sharedService.messages = [];
      this.sharedService.totalMessages = [];
      this.sharedService.lastMessage = null;
      this.sharedService.unreadMessages = [];
      this.sharedService.messagesLoading = false;
      this.currentChatReceiver = receiver;
      this.getParticipantInfo(this.sharedService.selectedChat.receiverId);
    });

    this.sharedService.activeMessageId.subscribe(res => {
      if (res) {
        this.navigateToMessage(res)
      }
    });
    this.toastSubscription = this.SnackbarMessageService.onConfirmResult.subscribe(status => {
      if (status == true && this.sharedService.selectedMessageForDelete) {
        this.delete(this.sharedService.selectedMessageForDelete);
      }
    });
  }

  getBackgroundImage() {
    // Build the path to the background image
    return `url('../../../../assets/images/wallpaper/background (${this.sharedService.randomWallpaperIndex}).jpg')`;
  }

  ngOnDestroy(): void {
    this.resetData();
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    this.sharedService.isFirstLoading = false;
    this.currentChatReceiver = '';
    this.sharedService.selectedChat = null;
  }

  unsubscribe() {
    if (this.subscrptions && this.subscrptions.length > 0)
      this.subscrptions.forEach(subscrption => {
        subscrption.unsubscribe();
      });
  }

  getParticipantInfo(participantId) {
    if (!participantId) return;
    this.sharedService.receiverId = participantId;
    this.subscrptions.push(this.apiService.getChatInfo(participantId,this.chatListService.activeTab).subscribe((res: any) => {
        if (!res) {
          this.SnackbarMessageService.error('No data found');
          this.sharedService.isShowSearchIcon = false;
          return;
        }
        if (res) {
          this.sharedService.groupInfo = res;
          this.setData();
          this.messageReceiver = this.sharedService.groupInfo.groupId;
          if (this.sharedService.groupInfo.groupId != '' && this.sharedService.searchInChat) {
            this.navigateToMessage(this.sharedService.searchedChatId)
          }
          this.title.setTitle(this.sharedService.groupInfo.title);
          this.chatListService.applySelectedChatListRow(this.sharedService.groupInfo.groupId)
          this.sharedService.setUnreadCount();
          this.sharedService.getMessages();
          this.sharedService.visitAllMessage();
        }
      })
    );
  }

  setData() {
    this.sharedService.groupInfo.isCreator = this.sharedService.groupInfo.creator == this.userService.userData.username ? true : false;
  }

  resetData() {
    this.unsubscribe();
    this.sharedService.unsubscribeMessages();
    this.sharedService.groupInfo = null;
    this.sharedService.messages = [];
    this.sharedService.totalMessages = [];
    this.sharedService.lastMessage = null;
    this.sharedService.unreadMessages = [];
    this.sharedService.messagesLoading = false;
    this.uploadService.uploadFiles = [];
  }

  droppedFiles(event) {
    this.uploadService.openUploadAreaModal("messages", event);
  }

  scroll() {
    this.showScrollDownBtn = this.messagesBody.nativeElement.scrollTop + 40 <= this.messagesBody.nativeElement.scrollHeight - this.messagesBody.nativeElement.clientHeight;
    const height = this.messagesBody.nativeElement.scrollHeight;
    const clientHeight = this.messagesBody.nativeElement.clientHeight;
    const currentScrollPosition = this.messagesBody.nativeElement.scrollTop;
    if (currentScrollPosition + clientHeight >= height) {
      if (!this.sharedService?.lastMessage) {
        return
      }
      let activeChat = this.chatListService.chatFeeds.find(x => x.groupId == this.sharedService?.lastMessage.receiverId);
      let lowestMessage = this.sharedService.lowestMessage.messageId;
      if (lowestMessage != activeChat.lastMessageId && activeChat.type == 'User') {
        this.getNewerMessages();
      }
    }
  }

  scrollEnd() {
    let receiverId = this.chatListService.selectedChatListRow.receiverId;
    let activeChat = this.chatListService.chatFeeds.find(x => x.receiverId == receiverId);
    if (activeChat.type != 'User') {
      this.sharedService.scrollToEnd();
      return;
    }
    let checkMessageId = this.sharedService.messages.find(x => x.messageId == activeChat.lastMessageId)
    if (checkMessageId) {
      this.sharedService.scrollToEnd();
      return
    }
    this.sharedService.messages = [];
    this.sharedService.totalMessages = [];
    this.sharedService.getMessagesForScrollEnd(-1);
  }

  showCurrentMessageContainer() {
    this.currentMessageContainer = this.elementRef.nativeElement.querySelector(`#totalMessage0`);
    this.currentMessageContainer.style.display = 'inherit';
  }

  showLastMessageContainer() {
    this.currentMessageContainer = this.elementRef.nativeElement.querySelector(`#totalMessage${this.sharedService.totalMessages.length - 1}`);
    this.currentMessageContainer.style.display = 'inherit';
  }

  scrollUp() {
    this.sharedService.isLoadingOlderMessages = true;
    this.getOlderMessages();
  }

  getOlderMessages() {
    if (this.sharedService.messagesLoading)
      return;
    this.sharedService.messagesLoading = false;
    this.sharedService.messagesFilter = this.sharedService.getMessagesFilter();
    this.sharedService.isFirstLoading = false;
    this.sharedService.isLoadingOlderMessages = true;
    this.sharedService.messagesSubscrption = this.messagesRepositoryService.get(this.sharedService.messagesFilter).subscribe(res => {
      if (res && res.length > 0) {
        this.sharedService.lastMessage = res[0];
        this.sendToArray(res);
      }
      if (!res || res.length == 0) {
        this.sharedService.isLoadingOlderMessages = false;
        this.sharedService.messagesLoading = false;
      }
    })
  }

  getNewerMessages() {
    if (this.sharedService.messagesLoading)
      return;
    this.sharedService.messagesLoading = false;
    let messageId = this.sharedService.messages[this.sharedService.messages.length - 1].messageId;
    if (messageId == -1) {
      return;
    }
    this.sharedService.messagesFilter = this.sharedService.getMessagesFilter('DOWN', messageId);
    this.sharedService.messagesSubscrption = this.messagesRepositoryService.get(this.sharedService.messagesFilter).subscribe(res => {
      if (res && res.length > 0) {
        this.sharedService.lowestMessage = res[res.length - 1];
        this.sendToArrayForNewMessages(res);
      }
      if (!res || res.length == 0) {
        this.sharedService.isLoadingOlderMessages = false;
        this.sharedService.messagesLoading = false;
      }
    })
  }

  sendToArrayForNewMessages(array) {
    if (array) {
      let i = this.sharedService.messages.findIndex(x => x.messageId == array[array.length - 1].messageId)
      if (i == -1) {
        this.sharedService.messages = [...this.sharedService.messages, ...array,];
        this.sharedService.totalMessages = [...this.sharedService.totalMessages, array];
        setTimeout(_ => {
          this.showLastMessageContainer();
        }, 1);
        setTimeout(_ => {
          this.setLoadingsFalse();
        }, 1)
        this.sharedService.loadingChatSearch = false;
        this.sharedService.localSearch({ type: "searchText", data: this.sharedService.searchText })
      }
    }
  }

  sendToArray(array) {
    if (array) {
      let i = this.sharedService.messages.findIndex(x => x.messageId == array[array.length - 1].messageId)
      if (i == -1) {
        this.sharedService.messages = [...array, ...this.sharedService.messages];
        this.sharedService.totalMessages = [array, ...this.sharedService.totalMessages];
        setTimeout(_ => {
          this.showCurrentMessageContainer();
        }, 1);

        setTimeout(_ => {
          this.setLoadingsFalse();
        }, 1)
        this.sharedService.loadingChatSearch = false;
        this.sharedService.localSearch({ type: "searchText", data: this.sharedService.searchText })
      }
    }
  }

  setLoadingsFalse() {
    this.sharedService.messagesLoading = false;
    this.sharedService.isFirstLoading = false;
    this.sharedService.isLoadingOlderMessages = false;
  }

  navigateToMessage(ev) {
    this.sharedService.scrollToElementById(ev);
    this.sharedService.changeSelectedMessageColor(ev);
  }

  delete(msg: MessageRecord) {
    this.messagesRepositoryService.delete(msg.receiverId, msg.messageId).subscribe(() => {
      let index = this.sharedService.messages.findIndex(x => x.contentId == msg.contentId)
      this.sharedService.messages.splice(index, 1);
      let i = this.chatListService.chatFeeds.findIndex(x => +x.lastMessageId == msg.id);
      if (i > -1) {
        this.chatListService.chatFeeds.splice(i, 1);
      }
    })
  }
}

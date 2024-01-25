import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';
import {EventEmitter, Injectable, Output} from '@angular/core';
import {BehaviorSubject, Observable, Subscription} from 'rxjs';
import {NotificationService} from 'src/app/shared/services/notification.service';
import {SignalrService} from 'src/app/shared/services/signalr.service';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';
import {UploadService} from 'src/app/shared/services/upload.service';
import {UserService} from 'src/app/shared/services/user.service';
import {MessageRecord} from '../models/message-record';
import {Participants} from '../models/participants';
import {MessageQuery} from '../models/message-query';
import {SendDto} from '../models/send-dto';
import {MessagesApiService} from './messages.api.service';
import {ConversationService} from './conversation.service';
import {MessagesDataRepositoryService} from './repositories/messages-data-repository.service';
import {UnreadService} from 'src/app/shared/services/unread.service';
import {Reply} from '../models/reply';
import {GroupMessageSearch} from '../models/group-message-search';
import {ChatRowRecord} from "../models/conversation-record";

declare var $: any;

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private currentChatReceiverSubject: BehaviorSubject<string> = new BehaviorSubject<string>('');
  public currentChatReceiver$: Observable<string> = this.currentChatReceiverSubject.asObservable();
  setCurrentChatReceiver$: any;
  setCurrentChatReceiver(receiver: string) {
    this.currentChatReceiverSubject.next(receiver);
  }

  randomWallpaperIndex: number;
  selectedChat:ChatRowRecord;
  menuPosition = {x: '0', y: '0'};
  showRightClickMenu = false;
  selectedContextMenu = null;
  isTyping: boolean = false;
  receiverId: string = null;
  groupInfo = new Participants();
  lastMessage: MessageRecord;
  lowestMessage: MessageRecord;
  messages: MessageRecord[] = [];
  totalMessages: any[] = [];
  selectedMessages: MessageRecord[] = [];
  messagesFilter = new MessageQuery();
  messagesLoading = false;
  replay = null;
  replayMessageContent: Reply = null;
  unreadMessages: number[] = [];
  searchInChat: boolean = false;
  searchedChatId: number = 0;
  messagesSubscrption: Subscription;
  notificationSent = false;
  modalRef: NgbModalRef;
  selectedMessageForDelete = null
  onLoadMoreChatSearch = new EventEmitter<any>();
  filteredChat: any;
  chatSearchResult: any = [];
  perviuseFilterChat: any;
  currentFilterdChat: number = 0;
  chatSearchResultCounter: number = 0;
  savePreviousFilterdChat: number = 0;
  fliterLength: number = 0;
  searchText: string = '';
  isShowSearchIcon: boolean = false;
  isShowSearchHeader: boolean = false;
  loadmore = false;
  loadingChatSearch: boolean = false;
  searchResultClick: boolean = false;
  chatSearchOffset: number = 0;
  chatSerachLimit: number = 5;
  chatSearchNextCall: number = 5;
  isFirstLoading: boolean = true;
  searchLoading: boolean = false;
  isLoadingOlderMessages: boolean = false;
  currentMessageContainer: HTMLElement;
  @Output() activeMessageId = new EventEmitter();

  constructor(
    private messagesRepositoryService: MessagesDataRepositoryService,
    private userService: UserService,
    private uploadService: UploadService,
    private chatListService: ConversationService,
    private apiService: MessagesApiService,
    private signalrService: SignalrService,
    private notificationService: NotificationService,
    private SnackbarMessageService: SnackbarMessageService,
    private modalService: NgbModal,
    private unreadService: UnreadService,
  ) {
    this.uploadService.onUploaded.subscribe(res => {
      if (res.source == "messages") {
        let message = new MessageRecord();
        message.attachments = res.attachments;
        this.send(message);
      }
    })
    this.signalrService.onSignalrConnected.subscribe(() => {
      this.signalrService.on('receiveTypingStatus', data => {
      });
      this.signalrService.on('receiveGroupTypingStatus', data => {
      });
      this.signalrService.on('receiverGroupContentInfo', (data) => {
        let parsed = JSON.parse(data);
        let i = this.chatListService.chatFeeds.findIndex(x => x.groupId == parsed.groupId);
        if (parsed.regUser != this.userService.userData.username) {
          this._handleGroupContentInfo(data);
        } else if (false) {
          this._handleGroupContentInfoForMySelf(data);
          this.chatListService.chatFeeds[i].content = parsed.content;
          this.chatListService.chatFeeds[i].lastMessageId = parsed.id;
          this.chatListService.chatFeeds[i].attachments = parsed.attachments;
          this.chatListService.chatFeeds[i].isSeen = false;
          this.chatListService.chatFeeds[i].unReadMessages = '';
          if (parsed.attachments != "-") {
            this.chatListService.chatFeeds[i].content = "Attachments";
          }
        }
      });

      this.signalrService.on('receiverUntilMessageVisit', (data) => {
        this._handleUntilMessageVisit(data);
      });
    });
    this.signalrService.onSignalrConnectedBeta.subscribe(() => {
      this.signalrService.onBeta('MessageSent', (data) => {
        let parsed = JSON.parse(data);
        let chat = this.chatListService.chatFeeds.find(x => x.groupId == parsed.receiverId);
        let groupType = parsed.groupTypeId == 17 ? "User" : "Group";
        if (!chat && this.chatListService.activeTab == groupType) {
          setTimeout(() => {
            this.chatListService.getChatList()
          }, 1000);
        }
        this._handleGroupContentInfo(data);
      });
      this.signalrService.onBeta('GroupVisitorAdded', (data) => {
        this._handleUntilMessageVisit(data);
      });
      this.signalrService.onBeta('ContentDeleted', (data) => {
        this._handleGroupContentDeleted(data);
      });
    });
    document.addEventListener('click', (element: any) => {
      this.showRightClickMenu = false;
    });
  }

  localSearch(searchData) {
    if (searchData.data != this.searchText) {
      this.clearSearch();
    }
    this.filteredChat = this.messages.filter(function (obj) {
      return obj.content == searchData.data;
    });
    this.perviuseFilterChat = this.filteredChat;
    this.searchText = searchData.data;
    this.currentFilterdChat = this.filteredChat.length;
    if (this.savePreviousFilterdChat != 0 && this.loadmore) {
      this.currentFilterdChat = this.filteredChat.length - this.savePreviousFilterdChat;
      this.savePreviousFilterdChat = 0;
    }
    this.filteredChat.forEach(element => {
      var elmnt = document.getElementById('groupRow' + element.id);
      if (elmnt != undefined) {
        elmnt.style.background = '#83ff8180 !important';
      }
    });
  }

  nextSearchResult() {
    if (this.currentFilterdChat > 0) {
      this.chatSearchResultCounter++;
      var next = this.filteredChat[--this.currentFilterdChat]
      if (next.id != undefined) {
        this.scrollToElementById(next.id);
        this.changeSelectedMessageColor(next.id);
      }
    }
    if (this.currentFilterdChat == 0) {
      this.loadmore = true;
      this.savePreviousFilterdChat = this.filteredChat.length;
      this.getMessages();
    }
  }

  previousSearchResult() {
    if (this.currentFilterdChat < this.fliterLength - 1) {
      this.chatSearchResultCounter--;
      var previous = this.filteredChat[++this.currentFilterdChat];
      this.scrollToElementById(previous.id);
      this.changeSelectedMessageColor(previous.id);
    }
  }

  clearSearch() {
    if (this.perviuseFilterChat != undefined) {
      this.perviuseFilterChat.forEach(element => {
        var elmnt = document.getElementById('groupRow' + element.id);
        if (elmnt != undefined) {
          elmnt.style.background = '';
        }
      });
    }
    this.loadmore = false;
    this.savePreviousFilterdChat = 0;
    this.chatSearchResultCounter = 0;
    this.currentFilterdChat = 0;
    this.fliterLength = 0;
    this.chatSearchResult = [];
    this.filteredChat = [];
    this.chatSearchOffset = 0;
    this.chatSerachLimit = 5;
    this.searchText = "";
  }

  serverSearch(searchData) {
    this.loadingChatSearch = false;
    this.chatSearchResult = [...this.chatSearchResult, ...searchData];
    this.fliterLength = this.chatSearchResult.length;
  }

  getSearchResultByMessageId(messageId: number, groupId: string) {
    let findMessage = this.messages.find(x => x.messageId == messageId);
    if (findMessage) {
      this.internalSearch(messageId);
      return;
    }
    let filter = new GroupMessageSearch();
    filter.messageId = messageId,
      filter.groupId = groupId;
    this.messagesRepositoryService.getSearchResultByMessageId(filter).subscribe((res: any) => {
      this.totalMessages = [];
      this.messages = [];
      this.searchLoading = true;
      this.getSearchResultMessages(res);
      setTimeout(() => {
        this.scrollToElementById(messageId);
        this.changeSelectedMessageColor(messageId);
        this.searchLoading = false;
      }, 1000);
    })
  }

  internalSearch(messageId) {
    this.scrollToElementById(messageId);
    this.changeSelectedMessageColor(messageId);
  }

  changeSelectedMessageColor(messageId) {
    var elmnt = document.getElementById('groupRow' + messageId);
    setTimeout(() => {
      if (elmnt != undefined) {
        elmnt.style.background = '#595959';
      }
    }, 1000);
    setTimeout(() => {
      if (elmnt != undefined) {
        elmnt.style.background = 'unset';
      }
    }, 3000);
  }

  async getMessages() {
    if (this.messagesLoading) {
      return;
    }
    this.messagesLoading = true;
    this.messagesFilter = this.getMessagesFilter();
    const messages = await this.messagesRepositoryService.get(this.messagesFilter).toPromise();
    if (!messages || messages.length == 0) {
      this.isFirstLoading = false;
      this.messagesLoading = false;
      return;
    } else if (messages && messages.length > 0) {
      this.lastMessage = messages[0];
      this.lowestMessage = messages[messages.length - 1];
      this.sendToArray(messages);
    }
    this.scrollToEnd();
  }


  async getMessagesForScrollEnd(messageId: number) {
    if (this.messagesLoading) {
      return;
    }
    this.messagesLoading = true;
    this.messagesFilter = this.getMessagesFilter("UP", messageId);
    const messages = await this.messagesRepositoryService.get(this.messagesFilter).toPromise();
    if (!messages || messages.length == 0) {
      this.isFirstLoading = false;
      this.messagesLoading = false;
      return;
    } else if (messages && messages.length > 0) {
      this.lastMessage = messages[0];
      this.lowestMessage = messages[messages.length - 1];
      this.sendToArray(messages);
      setTimeout(() => {
        this.setLoadingsFalse();
        this.showCurrentMessageContainer();
      }, 100);
      this.scrollToEnd();
    }
  }


  getSearchResultMessages(messages) {
    if (this.messagesLoading) {
      return;
    }
    this.messagesLoading = true;
    this.messagesFilter = this.getMessagesFilter();
    if (!messages || messages.length == 0) {
      this.isFirstLoading = false;
      this.messagesLoading = false;
      return;
    } else if (messages && messages.length > 0) {
      this.sendToArray(messages);
      setTimeout(() => {
        this.lastMessage = messages[0];
        this.lowestMessage = messages[messages.length - 1];
      }, 1000);
    }
  }

  sendToArray(array) {
    if (array) {
      let i = this.messages.findIndex(x => x.id == array[array.length - 1].id)
      if (i == -1) {
        this.messages = [...array, ...this.messages];
        this.totalMessages = [array, ...this.totalMessages];
        this.loadingChatSearch = false;
        this.localSearch({type: "searchText", data: this.searchText})
      }
      if (this.groupInfo.firstUnreadMessageId > 0) {
        setTimeout(_ => {
          this.showCurrentMessageContainer();
          this.scrollToElement();
        }, 1);

        setTimeout(_ => {
          this.setLoadingsFalse();
        }, 200);
        return;
      }
      if (this.isFirstLoading && !this.isLoadingOlderMessages) {
        setTimeout(_ => {
          this.showCurrentMessageContainer();
          this.scrollToEnd();
        }, 1);

        setTimeout(() => {
          this.setLoadingsFalse();
        }, 1);
      }
      if (this.searchLoading) {
        setTimeout(() => {
          this.showCurrentMessageContainer();
          this.setLoadingsFalse();
        }, 200);
      }
    }
  }

  showCurrentMessageContainer() {
    this.currentMessageContainer = document.querySelector(`#totalMessage0`) as HTMLElement
    this.currentMessageContainer.style.display = 'inherit';
  }

  setLoadingsFalse() {
    this.messagesLoading = false;
    this.isFirstLoading = false;
  }

  getMessagesFilter(dir: string = 'UP', messageId?: number) {
    if (messageId) {
      let filter: MessageQuery = {
        count: 35,
        dir: dir,
        groupId: this.groupInfo.groupId,
        messageId: messageId,
        self: false
      }
      return filter;
    } else {
      let filter: MessageQuery = {
        count: 35,
        dir: dir,
        groupId: this.groupInfo.groupId,
        messageId: this.lastMessage ? this.lastMessage.messageId : -1,
        self: false
      }
      return filter;
    }
  }

  unsubscribeMessages() {
    if (this.messagesSubscrption)
      this.messagesSubscrption.unsubscribe();
  }

  scrollToEnd() {
    setTimeout(() => {
      var div = document.getElementsByClassName("messages__body")[0];
      div.scrollTop = div.scrollHeight + 48;
    }, 150);
  }

  scrollToElement() {
    setTimeout(() => {
      var elmnt = document.getElementById('groupRow' + this.groupInfo.firstUnreadMessageId);
      elmnt.scrollIntoView(false);
    }, 150);
  }

  scrollToElementById(messageId) {

    setTimeout(() => {
      var elmnt = document.getElementById('groupRow' + messageId);
      if (elmnt) {
        elmnt.scrollIntoView(false);
      }
    }, 250);
  }

  visiting = false;

  visitAllMessage() {
    if (this.unreadMessages.length > 0) {
      let maxId = Math.max(...this.unreadMessages)
      if (maxId > 0) {
        this.visiting = true;

        this.apiService.registerVisit(maxId, this.groupInfo.groupId).subscribe(() => {
          this.visiting = false;
          this.chatListService.resetUnreads(this.groupInfo.groupId);
          this.unreadService.updateChatUnreads();
        });
      }
    }
  }

  sendId = -1;
  sendIdArray: number[] = [];

  fromEditor(text?) {
    let message = new MessageRecord()
    message.content = this.escape(text);
    this.send(message);
  }

  send(message: MessageRecord) {
    this.sendMessage(message)
  }

  sendMessage(message: MessageRecord) {
    var tempId = 1; //TODO
    if (!message.content && message.attachments == '-') {
      return;
    }
    this.sendId = tempId;
    this.sendIdArray.push(this.sendId);
    message.id = this.sendId;
    message.fullName = this.userService.userData.fullname;
    message.regUser = this.userService.userData.username;
    message.profileAddress = this.userService.userData.profilePictureId;
    message.regDate = new Date().toString();
    message.isSelf = true;
    message.receiverId = this.groupInfo.groupId;
    if (this.replay) {
      message.messageTypeId = 3;
      message.parentId = this.replay.id;
      message.replyMessage.content = this.replay.content;
      message.replyMessage.attachments = this.replay.attachments;
      message.replyMessage.fullName = this.replay.fullName;
      message.replyMessage.groupTypeId = this.replay.groupTypeId;
      message.replyMessage.receiverId = this.replay.receiverId;
      message.replyMessage.messageId = this.replay.messageId;
      message.replyMessage.messageTypeId = this.replay.messageTypeId;
      message.replyMessage.profileAddress = this.replay.profileAddress;
      message.replyMessage.uniqueId = this.replay.uniqueId;
      message.replyMessage.regUser = this.replay.regUser;
    }
    this.messages.push(message);
    if (this.totalMessages.length == 0) {
      this.totalMessages.push([message]);
      setTimeout(_ => {
        this.showCurrentMessageContainer();
      }, 500);

    } else if (this.totalMessages.length > 0) {
      this.totalMessages[this.totalMessages.length - 1].push(message);
    }
    this.scrollToEnd();
    this.sendToDatabase(message);
  }

  sendToDatabase(item) {
    var message = new SendDto();
    message.content = item.content;
    message.receiver = this.groupInfo.groupId;
    message.attachments = item.attachments;
    if (this.replay) {
      this.replayMessageContent = new Reply();
      this.replayMessageContent.content = this.replay.content;
      this.replayMessageContent.attachments = this.replay.attachments;
      this.replayMessageContent.fullName = this.replay.fullName;
      this.replayMessageContent.groupTypeId = this.replay.groupTypeId;
      this.replayMessageContent.receiverId = this.replay.receiverId;
      this.replayMessageContent.messageId = this.replay.messageId;
      this.replayMessageContent.messageTypeId = this.replay.messageTypeId;
      this.replayMessageContent.profileAddress = this.replay.profileAddress;
      this.replayMessageContent.uniqueId = this.replay.uniqueId;
      this.replayMessageContent.regUser = this.replay.regUser;
      message.replyMessage = this.replayMessageContent;
      message.parentId = this.replay.messageId
      message.messageTypeId = 3;
    }
    this.replay = false;

    this.messagesRepositoryService.add(message).subscribe((res) => {
      let index = this.chatListService.chatFeeds.findIndex(x => x.groupId == this.groupInfo.groupId);
      if (index == -1) {
        this.chatListService.getChatList();
      } else {
        var tmp = this.chatListService.chatFeeds[index];
        tmp.content = message.content;
        tmp.lastMessageId = res.messageId;
        this.lowestMessage = res;
        tmp.regDateTime = item.regDate;
        tmp.isSeen = false;
        tmp.regUser = this.userService.userData.username;
        this.chatListService.chatFeeds.splice(index, 1);
        this.chatListService.chatFeeds.unshift(tmp);
      }
      this.updateMessageId(res);
    });
  }


  escape(str: string): string {
    try {
      str = decodeURI(str);
    } catch (e) {
    }
    let s = str.match(/%/);
    s = str.match(/\n/);
    s = str.match(/\r/);
    s = str.match(/\t/);
    s = str.match(/\\/);
    return str.replace(new RegExp('%25', 'g'), '%')
      .replace(new RegExp('%0A', 'g'), '\n')
      .replace(new RegExp('%0D', 'g'), '\r')
      .replace(new RegExp('%09', 'g'), '\t')
      .replace(new RegExp('%5C', 'g'), '\\')
      .replace(new RegExp('%3E', 'g'), '>')
      .replace(new RegExp('%3C', 'g'), '<')
  }

  updateMessageId(res) {
    let item = this.messages.find((x) => x.id == this.sendIdArray[0]);
    if (item) {
      item.messageId = res.messageId;
      item.uniqueId = res.uniqueId;
      this.sendIdArray.splice(0, 1);
    }
  }

  public forwardMessages(usernames: string[], type = 'MultiMessage') {
    if (usernames.length === 0)
      return;
    let strUsernames = usernames.join(',');
    let mainData = [];
    this.apiService.getChatInfo(strUsernames,this.chatListService.activeTab).subscribe((data: any) => {
      if (data.length == 0)
        return;
      if (type == 'MultiMessage') {
        this.selectedMessages.forEach(message => {
          let newItem = {groupId: data[0].groupId, content: message.content, attachments: message.attachments};
          mainData.push(newItem);
        });
      } else if (type == 'SingleMessage') {
        data.forEach(item => {
          let newItem = {
            groupId: item.groupId,
            content: this.selectedMessages[0].content,
            attachments: this.selectedMessages[0].attachments
          };
          mainData.push(newItem);
        })
      }
      this.reset();
      this._registerSelectedMessages(mainData);
    })
  }

  private _registerSelectedMessages(data: any[]) {
    if (data.length == 0) {
      this.modalService.dismissAll();
      this.chatListService.getChatList();
      return;
    }
    var message = new SendDto();
    message.content = data[0].content;
    message.receiver = data[0].groupId;
    message.attachments = data[0].attachments;

    this.messagesRepositoryService.add(message).subscribe(() => {
      setTimeout(() => {
        data.splice(0, 1);
        this._registerSelectedMessages(data);
      }, 500);
    });
  }

  handleGroupMessageSelect(item: MessageRecord) {
    if (item.isSelected) {
      item.isSelected = false;
      this.removeSelectedMessage(item);
    } else {
      item.isSelected = true;
      this.addSelectedMessage(item);
    }
  }

  removeSelectedMessage(groupMessage: MessageRecord) {
    let i = this.selectedMessages.findIndex(x => x.id == groupMessage.id);

    if (i > -1)
      this.selectedMessages.splice(i, 1);

    this._setSelectedMessagesActions();
  }

  addSelectedMessage(groupMessage: MessageRecord) {
    let i = this.selectedMessages.findIndex(x => x.id == groupMessage.messageId);

    if (i == -1)
      this.selectedMessages.push(groupMessage);

    this._setSelectedMessagesActions();
  }

  private _setSelectedMessagesActions() {
    this.showSelectedMessagesActions = this.selectedMessages.length > 0;
    this.showRemoveSelectedMessages = this.showSelectedMessagesActions && this.selectedMessages.every(x => x.regUser == this.userService.userData.username);
    this.showForwardSelectedMessages = this.showSelectedMessagesActions;
  }

  public showSelectedMessagesActions: boolean = false;
  public showRemoveSelectedMessages: boolean = false;
  public showForwardSelectedMessages: boolean = false;

  public reset() {
    this.selectedMessages.forEach(x => x.isSelected = false);
    this.selectedMessages = [];
    this.showSelectedMessagesActions = this.showRemoveSelectedMessages = this.showForwardSelectedMessages = false;
    this._setSelectedMessagesActions();
  }

  setUnreadCount() {
    this.unreadMessages = this.groupInfo.unReadMessages;
  }

  openWindowNotification(data) {
    if (this.notificationSent)
      return;
    this.notificationService.show("new message",  data.fullName , "", () => {
    })
    this.notificationSent = true;
    setTimeout(() => {
      this.notificationSent = false;
    }, 5000);
  }

  updateUnreads(data) {
    if (data.regUser != this.userService.userData.username) {
      let item = this.chatListService.chatFeeds.find(x => x.groupId == data.receiverId);
      if (item) {
        let unreadIds = [];
        if (item.unReadMessages) {
          unreadIds = item.unReadMessages.split(',');
        }
        unreadIds.push(data.messageId)
        item.unReadMessages = unreadIds.join(',');
        item.unreadCount = unreadIds.length;
        item.isSeen = data.isVisit;
        item.regUser = data.regUser;
        item.content = data.content;
        let index = this.chatListService.chatFeeds.findIndex(x => x.groupId == data.receiverId);
        this.chatListService.chatFeeds.splice(index, 1);
        this.chatListService.chatFeeds.unshift(item);
      }
    } else {
      let chatRow = this.chatListService.chatFeeds.find(x => x.groupId == data.receiverId);
      if (chatRow) {
        chatRow.content = data.content;
        chatRow.isSeen = data.isVisit;
        let index = this.chatListService.chatFeeds.findIndex(x => x.groupId == data.receiverId);
        this.chatListService.chatFeeds.splice(index, 1);
        this.chatListService.chatFeeds.unshift(chatRow);
      }
    }
  }

  handleVisit(data) {
    data.members.forEach(username => {
      if (username != this.userService.userData.username) {
        let userIndex = this.chatListService.chatFeeds.findIndex(x => x.receiverId == username)
        this.chatListService.chatFeeds[userIndex].isSeen = true
      }
      let item = this.chatListService.chatFeeds.find(x => x.groupId == data.groupId);
      if (item) {
        if (item.regUser == this.userService.userData.username)
          item.isSeen = true;
        let deliveredMessages = this.totalMessages[0].filter(x => x.isDelivered == false);
        deliveredMessages.forEach(message => {
          message.isDelivered = true;
        })
      }
      if (this.groupInfo.groupId == data.receiverId) {
        let items = this.messages.filter(x => x.isDelivered == false);
        if (items) {
          items.forEach(element => {
            element.isDelivered = true;
            element.isVisit = true;
          });
        }
      }
    });
  }

  handleScrollToEnd() {
    let val = $('.messages__body').prop('scrollHeight') - ($('.messages__body').scrollTop() + $('.messages__body').height() + 48);
    if (val <= 450) {
      this.scrollToEnd();
    }
  }

  private _handleUntilMessageVisit(data) {
    data = JSON.parse(data);
    this.handleVisit(data);
    this.unreadService.updateChatUnreads();
  }

  private _handleGroupContentDeleted(data) {
    data = JSON.parse(data);
    let message = this.messages.find(x => x.contentId == data.contentId)
    if (message) {
      message.content = 'deleted';
    }
    let i = this.chatListService.chatFeeds.findIndex(x => +x.lastMessageId == data.messageId);
    if (i > -1) {
      this.chatListService.chatFeeds[i].content = 'Deleted';
    }
  }

  private _handleGroupContentInfo(result) {
    var data = JSON.parse(result);
    this.openWindowNotification(data);
    this.SnackbarMessageService.chat(
      data.fullName,
      data.regUser, data.content,
      data.profileAddress, () => {
    })
    if (this.chatListService.selectedChatListRow == null) {
      this.chatListService.applySelectedChatListRow(data.groupId || data.receiverId);
    }
    if (this.chatListService.selectedChatListRow && this.chatListService.selectedChatListRow.groupId == data.receiverId) {
      var chat = this.chatListService.chatFeeds.find(x => x.groupId == data.receiverId || data.groupId);
      if (chat) {
        chat.lastMessageId = data.messageId;
      }
      this.messages.push(data);
      if (this.totalMessages.length == 0) {
        this.totalMessages.push([data]);
        setTimeout(_ => {
          this.showCurrentMessageContainer();
        }, 500);
      } else if (this.totalMessages.length > 0) {
        this.totalMessages[this.totalMessages.length - 1].push(data);
      }
      if (this.groupInfo) {
        this.chatListService.resetUnreads(this.groupInfo.groupId);
      }
      setTimeout(() => {
        this.handleScrollToEnd();
        this.registerVisit(data.messageId);
      }, 50);
    }
    this.updateUnreads(data);
  }

  private _handleGroupContentInfoForMySelf(data) {
    data = JSON.parse(data);
    data.content = data.content.replace(/%0A/g, '')
    if (this.chatListService.selectedChatListRow == null) {
      this.chatListService.applySelectedChatListRow(data.groupId);
    }
    if (this.chatListService.selectedChatListRow
      && this.chatListService.selectedChatListRow.groupId == data.groupId) {
      this.messages.push(data);
      this.chatListService.resetUnreads(this.groupInfo.groupId);
      setTimeout(() => {
        this.handleScrollToEnd();
        this.registerVisit(data.messageId);
      }, 50);
    }
    this.updateUnreads(data);
  }

  registerVisit(id) {
    this.apiService.registerVisit(id, this.groupInfo.groupId).subscribe(() => {
    });
  }

  summerizeReplyMsg(msg: string) {
    if (msg.length <= 100) {
      return msg;
    } else {
      return msg.substring(0, 100) + " ... ";
    }
  }
}

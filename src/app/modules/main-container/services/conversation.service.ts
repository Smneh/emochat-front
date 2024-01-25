import {SearchDto} from '../models/search-dto';
import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';
import {UserService} from 'src/app/shared/services/user.service';
import {ChatRowRecord} from '../models/conversation-record';
import {ConversationFilter} from '../models/conversation-filter';
import {ConversationsRepositoryService} from './repositories/conversations-repository.service';
import {SnackbarMessageService} from 'src/app/shared/services/snackbar-message.service';

@Injectable({
  providedIn: 'root'
})
export class ConversationService {

  loading = false;
  chatFeeds: ChatRowRecord[] = [];
  chatSearchFeed: SearchDto[] = [];
  chatListFilter = new ConversationFilter();
  chatFeedsCopy: ChatRowRecord[] = [];
  activeTab = 'User';
  searchStartRow = 0;
  searchRowCount = 15;
  searchLoading: boolean = false;
  chatListSubscrption: Subscription;
  selectedChatListRow = null;
  selectedGroupIdForRemove: string;

  constructor(private chatListRepositoryService: ConversationsRepositoryService,
    private userService: UserService,
    private SnackbarMessageService: SnackbarMessageService,
  ) {
    this.SnackbarMessageService.onConfirmResult.subscribe(res => {
      if (res) {
        if (this.selectedGroupIdForRemove) {
          this.chatListRepositoryService.deleteGroupById(this.selectedGroupIdForRemove).subscribe((res: any) => {
            let index = this.chatFeeds.findIndex(chat => chat.groupId == this.selectedGroupIdForRemove);
            if (index > -1) {
              this.chatFeeds.splice(index, 1);
            }
            this.activeTab = "Group";
          });
        }
      }
    })
  }

  getChatList(): Promise<ChatRowRecord[]> {
    return new Promise((resolve, reject) => {
      this.reset();
      this.chatListFilter.type = this.activeTab;
      this.chatListSubscrption = this.chatListRepositoryService.getAll(this.chatListFilter).subscribe((res: ChatRowRecord[]) => {
        if (res) {
          const filteredResponse: ChatRowRecord[] = res.filter((chatList) => {
            return chatList.lastMessageId !== undefined && chatList.lastMessageId > 0;
          })
          this.fillData(filteredResponse);
          resolve(filteredResponse);
        }
      })
    });
  }

  unsubscribeChatList() {
    if (this.chatListSubscrption)
      this.chatListSubscrption.unsubscribe();
  }

  getSearchUsers(txtSearch) {
    if (this.chatFeeds.length > 0)
      this.chatFeeds = []
    txtSearch = txtSearch.toLowerCase();
    for (let x of this.chatFeedsCopy) {
      if (x.title.toLowerCase().indexOf(txtSearch) > -1 || x.receiverId.toLowerCase().indexOf(txtSearch) > -1) {
        this.chatFeeds.push(x);
      }
    }
  }

  search(txtSearch: string) {
    this.chatSearchFeed = []
    this.searchStartRow = 0;
    if (txtSearch != '') {
      this.getSearchUsers(txtSearch);
    } else {
      this.getChatList();
    }
  }

  fillData(res) {
    this.chatFeeds = res;
    this.chatFeedsCopy = res;
    this.stopLoading();
  }

  fillSelectedChat(username) {
    const chatFeedRow = this.chatFeeds.find(x => x.receiverId == username)
    if (chatFeedRow) {
      this.selectedChatListRow = chatFeedRow;
    }
  }

  getNextData(txtSearch) {
    if (this.chatSearchFeed.length > 0) {
      this.getchatSrearchNextData(txtSearch);
    } else {
      this.getChatNextData();
    }
  }

  getchatSrearchNextData(txtSearch) {
    this.startChatSearchLoading();
    this.searchStartRow += this.searchRowCount;
  }


  getChatNextData() {
    this.chatListFilter.startRow += this.chatListFilter.rowCount;
    this.chatListRepositoryService.getAll(this.chatListFilter).subscribe(res => {
      this.chatFeeds = [...this.chatFeeds, ...res]
      console.log(this.chatFeeds)
    })
  }

  reset() {
    this.chatFeeds = [];
    this.chatSearchFeed = []
    this.chatFeedsCopy = [];
    this.chatListFilter = new ConversationFilter();
    this.startLoading();
  }

  startLoading() {
    this.loading = true;
  }

  startChatSearchLoading() {
    this.searchLoading = true;
  }

  stopLoading() {
    this.loading = false;
  }

  applySelectedChatListRow(groupId) {
    if (this.chatFeeds.length > 0) {
      let chat = this.chatFeeds.find(x => x.groupId == groupId);

      if (chat)
        this.selectedChatListRow = chat;
    }
  }

  resetUnreads(groupId) {
    let i = this.chatFeeds.findIndex(x => x.groupId == groupId)
    if (i > -1) {
      this.chatFeeds[i].unreadCount = 0;
      this.chatFeeds[i].unReadMessages = '';

      setTimeout(() => {
        this.chatFeeds[i].unreadCount = 0;
        this.chatFeeds[i].unReadMessages = '';
      }, 1000);
      if (this.chatFeeds[i].regUser == this.userService.userData.username)
        this.chatFeeds[i].isSeen = true;
    }
  }
}

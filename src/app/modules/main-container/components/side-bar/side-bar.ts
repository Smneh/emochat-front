import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {SecurityService} from 'src/app/shared/services/security.service';
import {ConversationService} from '../../services/conversation.service';
import {SharedService} from '../../services/groups.service';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {UnreadService} from 'src/app/shared/services/unread.service';
import {StorageService} from 'src/app/shared/services/storage.service';
import {ChatRowRecord} from "../../models/conversation-record";

@Component({
  selector: 'side-bar',
  templateUrl: './side-bar.html',
  styleUrls: ['./side-bar.scss', './responsive.scss']
})
export class SideBar implements OnInit, OnDestroy {
  imageCount = 20;
  searchInput = '';
  private searchTextChanged = new Subject<string>();
  @Input() displayMode: string = 'default';

  constructor(
    private securityService: SecurityService,
    public chatListService: ConversationService,
    public sharedService: SharedService,
    public unreadService: UnreadService,
    private storageService: StorageService
  ) {
    this.searchTextChanged.pipe(debounceTime(1000), distinctUntilChanged()).subscribe((res) => {
      this.searchInput = res;
      this.performChatSearch(res);
    });
  }
  ngOnDestroy(): void {
    this.chatListService.unsubscribeChatList();
  }

  ngOnInit(): void {
    this.chatListService.getChatList().then(() => this.chatListService.fillSelectedChat(this.sharedService.receiverId));
    this.sharedService.clearSearch();
    this.sharedService.loadingChatSearch = false;
  }

  loadMessages(selectedChat: ChatRowRecord): void {
    this.sharedService.selectedChat = selectedChat;
    this.sharedService.setCurrentChatReceiver(selectedChat.receiverId);
    this.sharedService.randomWallpaperIndex = Math.floor(Math.random() * this.imageCount) + 1;
  }

  search(ev) {
    this.searchTextChanged.next(ev.target.innerText);
  }

  performChatSearch(txtSearch) {
    this.chatListService.search(txtSearch);
  }

  setActiveTab(tab) {
    this.chatListService.activeTab = tab;
    this.storageService.store('ChatActiveTab', this.chatListService.activeTab)
    this.chatListService.getChatList();
  }
}

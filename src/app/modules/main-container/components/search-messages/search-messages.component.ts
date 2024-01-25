import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {SharedService} from '../../services/groups.service';
import {ConversationsRepositoryService} from '../../services/repositories/conversations-repository.service';

@Component({
  selector: 'search-messages',
  templateUrl: './search-messages.component.html',
  styleUrls: ['./search-messages.component.scss'],
})
export class SearchMessages implements OnInit {
  private txtSearch = new Subject<string>();
  contents: any[] = [];
  isOpen: boolean = false;
  serachInput: any = '';
  constructor(
    public sharedService: SharedService,
    private chatListRepositoryService: ConversationsRepositoryService
  ) {}

  ngOnInit(): void {
    this.sharedService.onLoadMoreChatSearch.subscribe((data) => {
      this.sharedService.chatSearchOffset +=
        this.sharedService.chatSearchNextCall;
      this.sharedService.chatSerachLimit +=
        this.sharedService.chatSearchNextCall;
      this.chatListRepositoryService
        .SearchMessage(
          this.serachInput,
          this.sharedService.chatSearchOffset,
          this.sharedService.chatSerachLimit,
          this.sharedService.groupInfo.groupId
        )
        .subscribe((res) => {
          this.sharedService.serverSearch(res);
        });
    });
  }

  close() {
    // this.sharedService.searchInChat = false;
  }

  startServerSearch(text) {
    this.sharedService.loadingChatSearch = true;
    this.chatListRepositoryService
      .SearchMessage(
        text,
        this.sharedService.chatSearchOffset,
        this.sharedService.chatSerachLimit,
        this.sharedService.groupInfo.groupId
      )
      .subscribe((res) => {
        this.sharedService.serverSearch(res);
      });
  }

  openSearchInput() {
    this.isOpen = !this.isOpen;
  }

  nextResult() {
    this.sharedService.nextSearchResult();
  }

  previousResult() {
    this.sharedService.previousSearchResult();
  }

  back() {
    this.sharedService.isShowSearchHeader = false;
    this.sharedService.clearSearch();
  }

  search() {
    this.sharedService.clearSearch();
    this.sharedService.localSearch({
      type: 'searchText',
      data: this.serachInput,
    });
    this.txtSearch.next(this.serachInput);
    // server search
    this.startServerSearch(this.serachInput);
  }
}

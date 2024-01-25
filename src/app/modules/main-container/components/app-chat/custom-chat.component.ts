import {Component, OnInit} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {ConfigsService} from 'src/app/shared/services/configs.service';
import {SharedService} from '../../services/groups.service';

@Component({
  selector: 'chat-app',
  templateUrl: './custom-chat.component.html',
  styleUrls: ['/custom-chat.component.scss', './responsive.scss']
})
export class CustomChatComponent implements OnInit {
  constructor(
    public configurationService: ConfigsService,
    public sharedService: SharedService,
    private title: Title
  ) {}

  ngOnInit(): void {
    this.sharedService.isShowSearchHeader  = false;
    this.title.setTitle('EmoChat');
  }

  onItemClick(messageId: number, groupId: string): void {
    this.sharedService.getSearchResultByMessageId(messageId, groupId);
  }

  onLoadMore(): void {
    this.sharedService.onLoadMoreChatSearch.emit();
    this.sharedService.loadingChatSearch  = true;
  }

  escapeString(str: string): string {
    return str
      .replace(/%25/g, '%')
      .replace(/%0A/g, '\n')
      .replace(/%0D/g, '\r')
      .replace(/%09/g, '\t')
      .replace(/%5C/g, '\\')
      .replace(/%3E/g, '>')
      .replace(/%3C/g, '<');
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Unread} from '../models/unread';
import {ConfigsService} from './configs.service';
import {ApiCallService} from './apiCall.service';
import {SecurityService} from './security.service';
import {SignalrService} from './signalr.service';
import {environment} from "../../../environments/environment";

@Injectable({
  providedIn: 'root',
})
export class UnreadService {
  unreadData: Unread = <Unread>{};

  constructor(
    private signalrService: SignalrService,
    private configurationService: ConfigsService,
    private apiCallService: ApiCallService,
    private securityService: SecurityService
  ) {
    if (this.configurationService.isReady) {
      this.updateChatUnreads();
    } else {
      this.configurationService.settingsLoaded$.subscribe((res) => {
        this.updateChatUnreads();
      });
    }
    this.signalrService.onSignalrConnected.subscribe(() => {
      this.init();
    });
  }

  init() {
    this.signalrService.on('receiverUntilMessageVisit', (data) => {
      this.updateChatUnreads();
    });
    this.signalrService.on('receiverGroupContentInfo', (data) => {
      this.updateChatUnreads();
    });
    this.signalrService.on('receiverGroupDeletedContentInfo', (data) => {
      this.updateChatUnreads();
    });
  }

  checkUserToken() {
    if (!this.securityService.GetUsername())
      return false;
    return true
  }
  updateChatUnreads() {
    if (!this.checkUserToken())
      return;
    this.getUnreadCount().subscribe((result: any) => {
      if (!result) {
        return
      }
      if (result){
        this.unreadData.chatGroup = result.chatCount ? result.chatCount : 0;
        this.unreadData.normalGroup = result.groupCount ? result.groupCount : 0;
      }
    });
  }

  getUnreadCount(): Observable<Unread> {
    return this.apiCallService.get(
      environment.Chat_Path + 'GetUnReadMessagesCount',null);
  }
}

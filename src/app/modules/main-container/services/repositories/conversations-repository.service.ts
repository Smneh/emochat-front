import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiCallService} from 'src/app/shared/services/apiCall.service';
import {ChatRowRecord} from '../../models/conversation-record';
import {ConversationFilter} from '../../models/conversation-filter';
import {Search} from '../../models/search';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class ConversationsRepositoryService {
  constructor(private apiCallService: ApiCallService) { }

  getAll(filter: ConversationFilter): Observable<ChatRowRecord[]> {
    const parameters:any = {
      type: filter.type ,
      startRow: filter.startRow ,
      rowCount: filter.rowCount
    }
    return this.apiCallService.get(environment.Chat_Path + 'GetChatsList', parameters)
  }

  SearchMessage(searchText: string, startRow: number, rowCount: number, receiverId: string): Observable<Search[]> {
    const parameters: any = {
      searchStr: searchText ,
      startRow: startRow ,
      rowCount: rowCount ,
      receiver: receiverId
    }
    return this.apiCallService.get(environment.Chat_Path + 'SearchMessage', parameters)
  }

  deleteGroupById(groupId: string) {
    const parameters: any = {
      groupId: groupId
    }
    return this.apiCallService.delete(environment.Chat_Path + 'DeleteGroupById?GroupId='+groupId, parameters)
  }
}

import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiCallService} from 'src/app/shared/services/apiCall.service';
import {MessageQuery} from '../../models/message-query';
import {SendDto} from '../../models/send-dto';
import {GroupMessageSearch} from '../../models/group-message-search';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessagesDataRepositoryService {

  constructor(private apiCallService: ApiCallService) { }

  get(filter: MessageQuery): Observable<any> {
    const parameters: any = {
      groupId: filter.groupId ,
      messageId: filter.messageId ,
      count: filter.count ,
      dir: filter.dir ,
      self:filter.self
    }
    return this.apiCallService.get(environment.Chat_Path +'GetMessages', parameters)
  }

  add(filter: SendDto): Observable<any> {
    const parameters:any = {
      content: filter.content,
      receiverId: filter.receiver,
      receiverType: filter.receiverType,
      parentId: filter.parentId,
      messageTypeId: filter.messageTypeId,
      attachments: filter.attachments,
      replyMessage: filter.replyMessage == "" ? null : filter.replyMessage,
      regDate: '0',
      regTime: '0',
    }
    return this.apiCallService.post(environment.Chat_Path + 'SendMessage', parameters)
  }

  delete(groupId, messageId): Observable<any> {
    const parameters: any = {
      groupId: groupId,
      messageId: messageId,
    }
    return this.apiCallService.delete(environment.Chat_Path+'DeleteMessage/'+groupId+'/'+messageId, parameters)
  }

  getSearchResultByMessageId(filter: GroupMessageSearch): Observable<any> {
    const parameters: any = {
      groupId: filter.groupId,
      messageId: filter.messageId,
      count: filter.count,
    }
    return this.apiCallService.get(environment.Chat_Path+'SearchMessagesWithCount', parameters)
  }
}

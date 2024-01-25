import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ApiCallService} from 'src/app/shared/services/apiCall.service';
import {Participants} from '../models/participants';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class MessagesApiService {

  constructor(private apiCallService: ApiCallService) { }

  getChatInfo(receiverId: string, type: string): Observable<Participants> {
    const parameters : any = {
      receiverId:receiverId,
      type:type
    }
    return this.apiCallService.get(environment.Chat_Path + 'GetChatInfo', parameters)
  }

  registerVisit(messageId: number, groupId: string) {
    const parameters: any = {
      messageId: messageId,
      groupId: groupId
    }
    return this.apiCallService.put(environment.Chat_Path + 'VisitMessages', parameters)
  }

  getVisitLog(id: number): Observable<any[]> {
    const parameters: any = {
      sourceId: id
    }
    return this.apiCallService.get( 'GetMessageVisitors', parameters);
  }
}

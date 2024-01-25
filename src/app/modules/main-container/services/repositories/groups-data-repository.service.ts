import {Participants} from '../../models/participants';
import {ApiCallService} from '../../../../shared/services/apiCall.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {GroupForm} from '../../models/group-form';
import {ParticipantsFilter} from "../../models/participants-filter";
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class GroupsDataRepositoryService {

  constructor(
    private apiCallService: ApiCallService
  ) { }

  getAllUsers(filter: ParticipantsFilter): Observable<any> {
    const params: any = {
      searchText: filter.searchText,
      offset: filter.skip,
      limit: filter.take,
    };
    return this.apiCallService.get(environment.Users_Path +'GetAllUsers', params)
  }

  delete(groupId: any): Observable<any> {
    const parameters: any = {
        groupId: groupId
      }
    return this.apiCallService.delete(environment.Chat_Path+'DeleteGroupById?GroupId='+groupId, parameters)
  }

  add(group: GroupForm): Observable<any> {
    const parameters: any = {
      title: group.title ,
      description: group.description ,
      profilePictureId: group.profilePictureId ,
      members:group.members
    }
    return this.apiCallService.post(environment.Chat_Path+'CreateGroup', parameters)
  }

  edit(group: Participants): Observable<any> {
    const parameters: any = {
      receiverId: group.groupId ,
      title: group.title ,
      description: group.description ,
      profilePictureId: group.profilePictureId
    }
    return this.apiCallService.put(environment.Chat_Path+'UpdateGroup', parameters)
  }

  getGroupById(groupId: string) {
    const parameters: any = {
      groupId: groupId
    }
    return this.apiCallService.get(environment.Chat_Path+'GetGroupById', parameters)
  }

  deleteMember(memberUsername:string ,groupId: string) {
    const parameters: any = {
      groupId: groupId,
      member:memberUsername
    }
    return this.apiCallService.put(environment.Chat_Path+'RemoveGroupMember', parameters)
  }

  addAdmin(adminUsername:string ,groupId: string) {
    const parameters: any = {
      groupId: groupId,
      member:adminUsername
    }
    return this.apiCallService.put(environment.Chat_Path+'AddGroupAdmin', parameters)
  }

  removeAdmin(adminUsername:string ,groupId: string) {
    const parameters: any = {
      groupId: groupId,
      member:adminUsername
    }
    return this.apiCallService.put(environment.Chat_Path+'RemoveGroupAdmin', parameters)
  }
}

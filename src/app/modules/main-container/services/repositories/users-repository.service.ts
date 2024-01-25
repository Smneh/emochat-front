import {ApiCallService} from 'src/app/shared/services/apiCall.service';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {ParticipantsFilter} from '../../models/participants-filter';
import {User} from '../../models/user';
import {environment} from "../../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class UsersRepositoryService {

  users: User[] = []
  members: User[] = []
  constructor(
    private apiCallService: ApiCallService
  ) { }

  getUsersWithExcludeFilter(filter: ParticipantsFilter): Observable<any> {
    const params: any = {
      groupId: filter.groupId,
      searchText: filter.searchText,
      offset: filter.skip,
      limit: filter.take,
    };
    return this.apiCallService.get(environment.Chat_Path +'GetUsersWithExcludeFilter', params)
  }

  getAll(filter: ParticipantsFilter): Observable<any> {
    const params: any = {
      searchText: filter.searchText,
      offset: filter.skip,
      limit: filter.take,
    };
    return this.apiCallService.get(environment.Users_Path +'GetAllUsers', params)
  }

  addMember(memberUsername:string ,groupId: string) {
    const parameters: any = {
      groupId: groupId,
      member:memberUsername
    }
    return this.apiCallService.put(environment.Chat_Path+'AddGroupMember', parameters)
  }

  getUserInfo(username: string): Observable<any> {
    const params: any = {
      username: username,
    };
    return this.apiCallService.get(environment.Users_Path +'GetUserInfo', params)
  }
}
